'use strict';

// Our modules
const app = require('../server');
const createJWT = require('../app/utils/createJWT.server.utils');
const config = require('../config/config');

// External modules
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const moment = require('moment');

const agent = request.agent(app);

// Models
const Template = mongoose.model('Template');
const Email = mongoose.model('Email');


let template, field, email, token;

// Email routes tests
describe('Email CRUD tests:', () => {

    beforeEach((done) => {

        token = createJWT('abc@ft.com');

        field = {
            label: 'Body',
            name: 'body',
            type: 'wysiwyg',
            options: []
        };

        template = new Template({
            name: 'Editorial',
            path: './templates/example.html',
            from: {
                address: 'email@email.ft.com',
                name: "Financial Times"
            },
            list: 'abcdefg',
            fields: [field]
        });

        template.save(() => {

            email = new Email({
                subject: 'Email subject',
                template: template._id,
                parts:[{
                    name: 'body',
                    value: '<p>Some body</p>'
                }],
                createdOn: Date.now()
            });

            done();

        });

    });

    /** POST /emails **/

    it('should be able to save an email', (done) => {
        agent
            .post('/emails')
            .set('Authorization', 'Bearer ' + token)
            .send(email)
            .expect(201)
            .end((emailSaveErr, emailSaveRes) => {

                if (emailSaveErr) {
                    return done(emailSaveErr);
                }

                (emailSaveRes.headers['cache-control']).should.equal('no-cache, no-store');


                Email.find({})
                    .exec((emailFindErr, emailFindRes) => {

                        // Handle emails get error
                        if (emailFindErr) {
                            return done(emailFindErr);
                        }

                        // Set assertions
                        (emailFindRes[0].template).should.match(email.template);

                        done();

                    });

            });

    });

    it('should be able to save an email that has to be sent now', (done) => {

        email = email.toObject();

        email.sendTime = 'now';

        agent
            .post('/emails')
            .set('Authorization', 'Bearer ' + token)
            .send(email)
            .expect(201)
            .end((emailSaveErr, emailSaveRes) => {

                if (emailSaveErr) {
                    return done(emailSaveErr);
                }

                (emailSaveRes.headers['cache-control']).should.equal('no-cache, no-store');


                Email.find({})
                    .exec((emailFindErr, emailFindRes) => {

                        // Handle emails get error
                        if (emailFindErr) {
                            return done(emailFindErr);
                        }

                        // Set assertions
                        (emailFindRes[0].sendTime).should.be.an.instanceOf(Date);


                        done();

                    });

            });

    });

    it('should not be able to save an email if no name is provided', (done) => {
        // Invalidate template field
        email = email.toObject();
        email.template = '';

        agent.post('/emails')
            .set('Authorization', 'Bearer ' + token)
            .send(email)
            .expect(400)
            .end((emailSaveErr, emailSaveRes) => {

                // Set message assertion
                should.exist(emailSaveRes);
                (emailSaveRes.body.message).should.equal('Email validation failed');

                done(emailSaveErr);

            });
    });


    it('should not be able to save an email if no auth token is provided', (done) => {

        agent.post('/emails')
            .send(email)
            .expect(401)
            .end((emailSaveErr, emailSaveRes) => {

                should.exist(emailSaveRes);
                (emailSaveRes.body.message).should.equal('Please make sure your request has an Authorization header');

                done(emailSaveErr);

            });
    });

    it('should return an error if the plain text is serialized when saving an email', (done) => {

        email.body = {
            plain: "Some body"
        };

        agent
            .post('/emails')
            .set('Authorization', 'Bearer ' + token)
            .send(email)
            .expect(400)
            .end((emailSaveErr, emailSaveRes) => {

                should.exist(emailSaveRes);
                (emailSaveRes.body.message).should.equal('The plain text body is read-only, it cannot be overridden');

                done(emailSaveErr);

            });

    });

    it('should be able to add the plain text when saving if the email contains an html body', (done) => {

        email.body = {
            html: "<p>Some body</p>"
        };

        agent
            .post('/emails')
            .set('Authorization', 'Bearer ' + token)
            .send(email)
            .expect(201)
            .end((emailSaveErr) => {

                if (emailSaveErr) {
                    return done(emailSaveErr);
                }

                Email.find({})
                    .exec((emailFindErr, emailFindRes) => {

                        // Handle emails get error
                        if (emailFindErr) {
                            return done(emailFindErr);
                        }

                        // Set assertions
                        (emailFindRes[0].template).should.match(email.template);
                        (emailFindRes[0].body.plain).should.match('Some body');

                        done();

                    });

            });

    });

    /** GET /emails **/

    it('should be able to get a list of emails', (done) => {

        email.save(() => {

            agent
                .get('/emails')
                .set('Authorization', 'Bearer ' + token)
                .end((emailsGetErr, emailsGetRes) => {

                    // Set assertion
                    (emailsGetRes.headers['cache-control']).should.equal('no-cache, no-store');
                    emailsGetRes.body.should.have.a.lengthOf(1);

                    done(emailsGetErr);
                });

        });
    });


    it('should not be able to get a list of emails if no auth token is provided', (done) => {

        email.save(() => {

            agent
                .get('/emails')
                .expect(401)
                .end((emailsGetErr, emailsGetRes) => {

                    should.exist(emailsGetRes);
                    (emailsGetRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    done(emailsGetErr);

                });

        });
    });

    /** GET /emails/:emailId **/

    it('should be able to get a single email', (done) => {

        email.save(() => {

            agent
                .get('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .end((emailGetErr, emailGetRes) => {

                    // Set assertion
                    (emailGetRes.headers['cache-control']).should.equal('no-cache, no-store');
                    emailGetRes.body.should.have.a.property('template');

                    done(emailGetErr);

                });
        });
    });


    it('should not be able to get a single email if no auth token is provided', (done) => {

        email.save(() => {

            agent
                .get('/emails/' + email._id)
                .expect(401)
                .end((emailGetErr, emailGetRes) => {

                    // Set message assertion
                    should.exist(emailGetRes);
                    (emailGetRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    done(emailGetErr);

                });

        });
    });

    /** PATCH /emails/:emailId **/

    it('should be able to patch an email', (done) => {

        email.save(() => {

            let patchEmail = { template: template._id };


            agent
                .patch('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchEmail)
                .expect(200)
                .end((emailPatchErr, emailPatchRes) => {

                    if (emailPatchErr) {
                        done(emailPatchErr);
                    }

                    // Set assertions
                    (emailPatchRes.headers['cache-control']).should.equal('no-cache, no-store');
                    (emailPatchRes.body._id).should.equal(email._id.toString());
                    (emailPatchRes.body.dirty).should.equal(true);

                    // Call the assertion callback
                    done(emailPatchErr);
                });

        });
    });

    it('should be able to patch an email to be sent now', (done) => {

        email.save(() => {

            let patchEmail = { sendTime: 'now' };


            agent
                .patch('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchEmail)
                .expect(200)
                .end((emailPatchErr, emailPatchRes) => {

                    if (emailPatchErr) {
                        done(emailPatchErr);
                    }

                    // Set assertions
                    (emailPatchRes.headers['cache-control']).should.equal('no-cache, no-store');
                    (emailPatchRes.body._id).should.equal(email._id.toString());
                    (new Date(emailPatchRes.body.sendTime)).should.be.an.instanceOf(Date);


                    // Call the assertion callback
                    done(emailPatchErr);
                });

        });
    });

    it('should be able to update the plain text body when receiving a patch with an HTML body', (done) => {

        email.save(() => {

            let patchEmail = { body: { html: '<p>Some other text</p>' } };

            agent
                .patch('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchEmail)
                .expect(200)
                .end((emailPatchErr, emailPatchRes) => {

                    if (emailPatchErr) {
                        done(emailPatchErr);
                    }

                    // Set assertions
                    (emailPatchRes.body.body.plain).should.match('Some other text');

                    // Call the assertion callback
                    done(emailPatchErr);
                });

        });
    });

    it('should be able to set an email as not dirty', (done) => {

        email.save(() => {

            let patchEmail = { dirty: false };

            agent
                .patch('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchEmail)
                .expect(200)
                .end((emailPatchErr, emailPatchRes) => {

                    if (emailPatchErr) {
                        done(emailPatchErr);
                    }

                    // Set assertions
                    (emailPatchRes.body.dirty).should.equal(false);

                    // Call the assertion callback
                    done(emailPatchErr);
                });

        });
    });

    it('should return an error if the plain text is serialized when patching an email', (done) => {

        email.save(() => {

            let patchEmail = { body: { plain: 'Some other text' } };

            agent
                .patch('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchEmail)
                .expect(400)
                .end((emailPatchErr, emailPatchRes) => {

                    if (emailPatchErr) {
                        done(emailPatchErr);
                    }

                    // Set assertions
                    (emailPatchRes.body.message).should.match('The plain text body is read-only, it cannot be overridden');

                    // Call the assertion callback
                    done(emailPatchErr);
                });

        });

    });


    it('should not be able to  patch an email if an empty name is provided', (done) => {

        email.save(() => {

            let patchEmail = { template: '' };

            agent
                .patch('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchEmail)
                .expect(400)
                .end((emailPatchErr, emailPatchRes) => {

                    // Set message assertion
                    should.exist(emailPatchRes);
                    (emailPatchRes.body.message).should.equal('Email validation failed');

                    // Handle list save error
                    done(emailPatchErr);

                });

        });
    });

    it('should not be able to patch an email if no auth token is provided', (done) => {

        email.save(() => {

            agent
                .patch('/emails/' + email._id)
                .expect(401)
                .end((emailPatchErr, emailPatchRes) => {

                    // Set message assertion
                    should.exist(emailPatchRes);
                    (emailPatchRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    // Handle list save error
                    done(emailPatchErr);

                });

        });
    });

    it('should not be able to patch the content of an email if it has been already scheduled', (done) => {

        email.sendTime = Date.now();

        email.save(() => {

            let patchEmail = { template: '' };

            agent
                .patch('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchEmail)
                .expect(400)
                .end((emailPatchErr, emailPatchRes) => {

                    // Set message assertion
                    should.exist(emailPatchRes);
                    (emailPatchRes.body.message).should.equal('The email is already scheduled, the required property cannot be edited');

                    // Handle list save error
                    done(emailPatchErr);

                });

        });
    });


    it('should not be able to patch the content of an email if it has been already scheduled', (done) => {

        email.sendTime = Date.now();
        email.sent = true;

        email.save(() => {

            let patchEmail = { subject: 'Some subject' };

            agent
                .patch('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchEmail)
                .expect(400)
                .end((emailPatchErr, emailPatchRes) => {

                    // Set message assertion
                    should.exist(emailPatchRes);
                    (emailPatchRes.body.message).should.equal('Cannot patch. The email has already been sent');

                    // Handle list save error
                    done(emailPatchErr);

                });

        });
    });

    /** DELETE /emails/:emailId **/

    it('should be able to delete a email', (done) => {

        email.save(() => {

            agent
                .delete('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(email)
                .expect(200)
                .end((emailDelErr, emailDelRes) => {

                    if (emailDelErr) {
                        return done(emailDelErr);
                    }

                    (emailDelRes.headers['cache-control']).should.equal('no-cache, no-store');

                    Email.find({})
                        .exec((emailFindErr, emailFindRes) => {

                            // Handle emails get error
                            if (emailFindErr) {
                                return done(emailFindErr);
                            }

                            // Set assertions
                            emailFindRes.should.have.a.lengthOf(0);
                            done();

                        });

                });
        });
    });


    it('should not be able to delete an email if no auth token is provided', (done) => {

        email.save(() => {

            agent
                .delete('/emails/' + email._id)
                .expect(401)
                .end((emailDeleteErr, emailDeleteRes) => {

                    // Set message assertion
                    should.exist(emailDeleteRes);
                    (emailDeleteRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    // Handle list save error
                    done(emailDeleteErr);

                });

        });
    });


    it('returns an error if an invalid _id is provided', (done) => {
        email.save(() => {
            agent
                .get('/emails/' + 'invalidId')
                .set('Authorization', 'Bearer ' + token)
                .expect(400)
                .end((emailGetErr, emailGetRes) => {

                    // Set message assertion
                    should.exist(emailGetRes);
                    (emailGetRes.body.message).should.equal('Email ID is invalid');

                    done(emailGetErr);

                });

        });
    });

    it('returns an error if an invalid _id is provided', (done) => {

        let randomId = '55c8861dfdf6f00300b9f89a';

        email.save(() => {
            agent
                .get('/emails/' + randomId)
                .set('Authorization', 'Bearer ' + token)
                .expect(404)
                .end((emailGetErr, emailGetRes) => {

                    // Set message assertion
                    should.exist(emailGetRes);
                    (emailGetRes.body.message).should.equal('Email not found');

                    done(emailGetErr);

                });

        });
    });

    it('returns an error if an invalid jwt is provided', (done) => {

        let randomJWT = 'abcdefghijklmnopqrstuvwxyz';

        email.save(() => {
            agent
                .get('/emails/')
                .set('Authorization', 'Bearer ' + randomJWT)
                .expect(401)
                .end((emailGetErr, emailGetRes) => {

                    // Set message assertion
                    should.exist(emailGetRes);
                    (emailGetRes.body.message).should.equal('Invalid Token');

                    done(emailGetErr);

                });

        });
    });

    it('returns an error if an expired jwt is provided', (done) => {

        let payload = {
            email: 'abc@ft.com',
            expire: moment().subtract(3, 'hours').unix()
        };

        let expiredJWT = jwt.encode(payload, config.tokenSecret);

        email.save(() => {
            agent
                .get('/emails/')
                .set('Authorization', 'Bearer ' + expiredJWT)
                .expect(401)
                .end((emailGetErr, emailGetRes) => {

                    // Set message assertion
                    should.exist(emailGetRes);
                    (emailGetRes.body.message).should.equal('Token has expired');

                    done(emailGetErr);

                });

        });
    });

    it('allows to specify the a specific pagination returned', (done) => {


        // Create a new email
        let email2 = new Email({
            subject: 'Another Email',
            template: template._id,
            parts:[{
                name: 'body',
                value: '<p>Some other body</p>'
            }]
        });

        // Save the user
        email.save(() => {

            email2.save(() => {

                // Request the second email
                agent.get('/emails?pp=1&p=2')
                    .set('Authorization', 'Bearer ' + token)
                    .end((gerEmailErr, getEmailRes) => {

                        // Set assertion
                        getEmailRes.body.should.have.a.lengthOf(1);
                        (getEmailRes.headers['x-page']).should.equal('2');
                        (getEmailRes.headers['x-per-page']).should.equal('1');
                        (getEmailRes.headers['x-total-count']).should.equal('2');

                        // Call the assertion callback
                        done();
                    });
            });

        });

    });

    it('allows to filter emails by template', (done) => {

        // Create another template
        let template2 = new Template({
            name: 'Breaking news',
            path: './templates/example.html',
            from: {
                address: 'email@email.ft.com',
                name: "Financial Times"
            },
            list: 'abcdefg',
            fields: [field]
        });

        template2.save(() => {

            let email2 = new Email({
                subject: 'Another Email',
                template: template2._id,
                parts: [{
                    name: 'body',
                    value: '<p>Some other body</p>'
                }]
            });

            // Save the user
            email.save(() => {

                email2.save(() => {

                    // Request the second email
                    agent.get('/emails?t=' + template2._id)
                        .set('Authorization', 'Bearer ' + token)
                        .end((gerEmailErr, getEmailRes) => {

                            // Set assertion
                            getEmailRes.body.should.have.a.lengthOf(1);
                            (getEmailRes.body[0].template._id).should.match(template2._id.toString());

                            // Call the assertion callback
                            done();
                        });
                });

            });

        });

    });

    it('allows to filter emails by the "dirty" property', (done) => {


        let email2 = new Email({
            subject: 'Another Email',
            template: template._id,
            parts: [{
                name: 'body',
                value: '<p>Some other body</p>'
            }],
            dirty: true
        });

        // Save the user
        email.save(() => {

            email2.save(() => {

                // Request for the dirty emails
                agent.get('/emails?dirty')
                    .set('Authorization', 'Bearer ' + token)
                    .end((gerEmailErr, getEmailRes) => {

                        // Set assertion
                        getEmailRes.body.should.have.a.lengthOf(1);
                        (getEmailRes.body[0]._id).should.match(email2._id.toString());

                        // Request for the not-dirty emails
                        agent.get('/emails?dirty=false')
                            .set('Authorization', 'Bearer ' + token)
                            .end((gerEmailErr, getEmailRes) => {

                                // Set assertion
                                getEmailRes.body.should.have.a.lengthOf(1);
                                (getEmailRes.body[0]._id).should.match(email._id.toString());

                                // Call the assertion callback
                                done();
                            });
                    });
            });

        });

    });


    it('allows to filter emails by the "sent" property', (done) => {


        let email2 = new Email({
            subject: 'Another Email',
            template: template._id,
            parts: [{
                name: 'body',
                value: '<p>Some other body</p>'
            }],
            sent: true
        });

        // Save the user
        email.save(() => {

            email2.save(() => {

                // Request for the sent emails
                agent.get('/emails?sent')
                    .set('Authorization', 'Bearer ' + token)
                    .end((gerEmailErr, getEmailRes) => {

                        // Set assertion
                        getEmailRes.body.should.have.a.lengthOf(1);
                        (getEmailRes.body[0]._id).should.match(email2._id.toString());

                        // Request for the not-sent emails
                        agent.get('/emails?sent=false')
                            .set('Authorization', 'Bearer ' + token)
                            .end((gerEmailErr, getEmailRes) => {

                                // Set assertion
                                getEmailRes.body.should.have.a.lengthOf(1);
                                (getEmailRes.body[0]._id).should.match(email._id.toString());

                                // Call the assertion callback
                                done();
                            });
                    });
            });

        });


    });

    it('allows to filter emails by the "toSubEdit" property', (done) => {


        let email2 = new Email({
            subject: 'Another Email',
            template: template._id,
            parts: [{
                name: 'body',
                value: '<p>Some other body</p>'
            }],
            toSubEdit: true
        });

        // Save the user
        email.save(() => {

            email2.save(() => {

                // Request for the toSubEdit emails
                agent.get('/emails?toSubEdit')
                    .set('Authorization', 'Bearer ' + token)
                    .end((gerEmailErr, getEmailRes) => {

                        // Set assertion
                        getEmailRes.body.should.have.a.lengthOf(1);
                        (getEmailRes.body[0]._id).should.match(email2._id.toString());

                        // Request for the not-toSubEdit emails
                        agent.get('/emails?toSubEdit=false')
                            .set('Authorization', 'Bearer ' + token)
                            .end((gerEmailErr, getEmailRes) => {

                                // Set assertion
                                getEmailRes.body.should.have.a.lengthOf(1);
                                (getEmailRes.body[0]._id).should.match(email._id.toString());

                                // Call the assertion callback
                                done();
                            });
                    });
            });

        });


    });


    it('allows to filter emails by the "subEdited" property', (done) => {


        let email2 = new Email({
            subject: 'Another Email',
            template: template._id,
            parts: [{
                name: 'body',
                value: '<p>Some other body</p>'
            }],
            subEdited: true
        });

        // Save the user
        email.save(() => {

            email2.save(() => {

                // Request for the subEdited emails
                agent.get('/emails?subEdited')
                    .set('Authorization', 'Bearer ' + token)
                    .end((gerEmailErr, getEmailRes) => {

                        // Set assertion
                        getEmailRes.body.should.have.a.lengthOf(1);
                        (getEmailRes.body[0]._id).should.match(email2._id.toString());

                        // Request for the not-subEdited emails
                        agent.get('/emails?subEdited=false')
                            .set('Authorization', 'Bearer ' + token)
                            .end((gerEmailErr, getEmailRes) => {

                                // Set assertion
                                getEmailRes.body.should.have.a.lengthOf(1);
                                (getEmailRes.body[0]._id).should.match(email._id.toString());

                                // Call the assertion callback
                                done();
                            });
                    });
            });

        });


    });

    it('allows to filter emails that need to be sent now', (done) => {


        let email2 = new Email({
            subject: 'Another Email',
            template: template._id,
            parts: [{
                name: 'body',
                value: '<p>Some other body</p>'
            }],
            sendTime: Date.now()
        });

        // Save the user
        email.save(() => {

            email2.save(() => {

                // Request for the emails toSend
                agent.get('/emails?toSend')
                    .set('Authorization', 'Bearer ' + token)
                    .end((gerEmailErr, getEmailRes) => {

                        // Set assertion
                        getEmailRes.body.should.have.a.lengthOf(1);
                        (getEmailRes.body[0]._id).should.match(email2._id.toString());

                        done(gerEmailErr);

                    });
            });

        });


    });


    afterEach((done) => {
        Email.remove()
            .exec(() => Template.remove().exec(done));
    });



});
