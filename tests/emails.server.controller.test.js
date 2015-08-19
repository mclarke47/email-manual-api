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


let template, email, token;

// Email routes tests
describe('Email CRUD tests:', () => {

    beforeEach((done) => {

        token = createJWT('abc@ft.com');

        let field = {
            name: 'body',
            type: 'wysiwyg',
            options: []
        };

        template = new Template({
            name: 'Editorial',
            path: './templates/example.html',
            fields: [field]
        });

        template.save(() => {

            email = new Email({
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

    it('should be able to save an email', (done) => {
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

    it('should be able to get a list of emails', (done) => {

        email.save(() => {

            agent
                .get('/emails')
                .set('Authorization', 'Bearer ' + token)
                .end((emailsGetErr, emailsGetRes) => {

                    // Set assertion
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

    it('should be able to get a single email', (done) => {

        email.save(() => {

            agent
                .get('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .end((emailGetErr, emailGetRes) => {

                    // Set assertion
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



    it('should not be able to  patch an email if no auth token is provided', (done) => {

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

    it('should be able to delete a email', (done) => {

        email.save(() => {

            agent
                .delete('/emails/' + email._id)
                .set('Authorization', 'Bearer ' + token)
                .send(email)
                .expect(200)
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

    afterEach((done) => {
        Email.remove()
            .exec(() => Template.remove().exec(done));
    });

});
