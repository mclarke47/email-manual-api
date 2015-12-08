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

let template, token;

// Template routes tests
describe('Template CRUD tests:', () => {

    beforeEach((done) => {

        let field = {
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

        token = createJWT('abc@ft.com');

        done();


    });

    /** POST /templates **/

    it('should be able to save a template', (done) => {
        agent
            .post('/templates')
            .set('Authorization', 'Bearer ' + token)
            .send(template)
            .expect(201)
            .end((templateSaveErr, templateSaveRes) => {

                if (templateSaveErr) {
                    return done(templateSaveErr);
                }

                (templateSaveRes.headers['cache-control']).should.equal('no-cache, no-store');

                Template.find({})
                    .exec((templateFindErr, templateFindRes) => {

                        // Handle templates get error
                        if (templateFindErr) {
                            return done(templateFindErr);
                        }

                        // Set assertions
                        (templateFindRes[0].name).should.match(template.name);
                        (templateFindRes[0].path).should.match(template.path);

                        done();

                    });

            });

    });

    it('should not be able to save a template if no name is provided', (done) => {
        // Invalidate name field
        template.name = '';

        agent.post('/templates')
            .set('Authorization', 'Bearer ' + token)
            .send(template)
            .expect(400)
            .end((templateSaveErr, templateSaveRes) => {

                // Set message assertion
                should.exist(templateSaveRes);
                (templateSaveRes.body.message).should.equal('Template validation failed');

                done(templateSaveErr);

            });
    });


    it('should not be able to save a template if no auth token is provided', (done) => {

        agent.post('/templates')
            .send(template)
            .expect(401)
            .end((templateSaveErr, templateSaveRes) => {

                should.exist(templateSaveRes);
                (templateSaveRes.body.message).should.equal('Please make sure your request has an Authorization header');

                done(templateSaveErr);

            });
    });

    it('should respond with an error if the template path is incorrect when saving a template', (done) => {

        template.path = './templates/notExistingTemplate.html';

            agent.post('/templates')
                .set('Authorization', 'Bearer ' + token)
                .send(template)
                .expect(400)
                .end((templateGetErr, templateGetRes) => {

                    // Set assertion
                    templateGetRes.body.should.have.a.property('message', 'There is a problem reading the template source');

                    done(templateGetErr);

                });
    });

    /** GET /templates **/

    it('should be able to get a list of templates', (done) => {

        template.save(() => {

            agent
                .get('/templates')
                .set('Authorization', 'Bearer ' + token)
                .end((templatesGetErr, templatesGetRes) => {

                    // Set assertion
                    (templatesGetRes.headers['cache-control']).should.equal('no-cache, no-store');
                    templatesGetRes.body.should.have.a.lengthOf(1);

                    done(templatesGetErr);
                });

        });
    });

    it('should be able to get a list of templates using basic auth', (done) => {

        let auth = "Basic " + new Buffer(config.authUser + ":" + config.authPassword).toString("base64");

        template.save(() => {

            agent
                .get('/templates')
                .set('Authorization', auth)
                .end((templatesGetErr, templatesGetRes) => {

                    // Set assertion
                    templatesGetRes.body.should.have.a.lengthOf(1);

                    done(templatesGetErr);
                });

        });
    });

    it('should receive an error when the wrong credentials are sent', (done) => {

        let auth = "Basic " + new Buffer(config.authUser + ":" + config.authPassword+'x').toString("base64");

        template.save(() => {

            agent
                .get('/templates')
                .set('Authorization', auth)
                .end((templatesGetErr, templatesGetRes) => {

                    // Set assertion
                    (templatesGetRes.body.message).should.equal('Invalid username or password');

                    done(templatesGetErr);
                });

        });
    });

    it('should not be able to get a list of templates using an unsupported authentication method', (done) => {

        let auth = "Some method";

        template.save(() => {

            agent
                .get('/templates')
                .set('Authorization', auth)
                .expect(401)
                .end((templatesGetErr, templatesGetRes) => {

                    // Set assertion
                    (templatesGetRes.body.message).should.equal('Authentication method not supported');

                    done(templatesGetErr);
                });

        });
    });


    it('should not be able to get a list of templates if no auth token is provided', (done) => {

        template.save(() => {

            agent
                .get('/templates')
                .expect(401)
                .end((templatesGetErr, templatesGetRes) => {

                    should.exist(templatesGetRes);
                    (templatesGetRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    done(templatesGetErr);

                });

        });
    });


    /** GET /templates/:templateId **/

    it('should be able to get a single template', (done) => {

        template.save(() => {

            agent
                .get('/templates/' + template._id)
                .set('Authorization', 'Bearer ' + token)
                .end((templateGetErr, templateGetRes) => {

                    // Set assertion
                    (templateGetRes.headers['cache-control']).should.equal('no-cache, no-store');
                    templateGetRes.body.should.have.a.property('name', template.name);

                    done(templateGetErr);

                });
        });
    });


    it('should respond with an error if the template path is incorrect when retrieving a template', (done) => {

        template.path = './templates/notExistingTemplate.html';

        template.save(() => {

            agent
                .get('/templates/' + template._id)
                .expect(400)
                .set('Authorization', 'Bearer ' + token)
                .end((templateGetErr, templateGetRes) => {

                    // Set assertion
                    templateGetRes.body.should.have.a.property('message', 'There is a problem reading the template source');

                    done(templateGetErr);

                });
        });
    });

    it('should not be able to get a single template if no auth token is provided', (done) => {

        template.save(() => {

            agent
                .get('/templates/' + template._id)
                .expect(401)
                .end((templateGetErr, templateGetRes) => {

                    // Set message assertion
                    should.exist(templateGetRes);
                    (templateGetRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    done(templateGetErr);

                });

        });
    });


    /** PATCH /templates/:templateId **/

    it('should be able to patch a template', (done) => {

        template.save(() => {
            
            let patchTemplate = { name: 'A new name' };
            

            agent
                .patch('/templates/' + template._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchTemplate)
                .expect(200)
                .end((templatePatchErr, templatePatchRes) => {

                    if (templatePatchErr) {
                        done(templatePatchErr);
                    }

                    // Set assertions
                    (templatePatchRes.headers['cache-control']).should.equal('no-cache, no-store');
                    (templatePatchRes.body._id).should.equal(template._id.toString());
                    (templatePatchRes.body.name).should.equal(patchTemplate.name);

                    // Call the assertion callback
                    done(templatePatchErr);
                });

        });
    });

    it('should not be able to  patch a template if an empty name is provided', (done) => {

        template.save(() => {

            let patchTemplate = { name: '' };

            agent
                .patch('/templates/' + template._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchTemplate)
                .expect(400)
                .end((templatePatchErr, templatePatchRes) => {

                    // Set message assertion
                    should.exist(templatePatchRes);
                    (templatePatchRes.body.message).should.equal('Validation failed');

                    // Handle list save error
                    done(templatePatchErr);

                });

        });
    });

    it('should not be able to  patch a template if no auth token is provided', (done) => {

        template.save(() => {

            agent
                .patch('/templates/' + template._id)
                .expect(401)
                .end((templatePatchErr, templatePatchRes) => {

                    // Set message assertion
                    should.exist(templatePatchRes);
                    (templatePatchRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    // Handle list save error
                    done(templatePatchErr);

                });

        });
    });

    it('should respond with an error if the template path is incorrect when patching a template', (done) => {

        let patchTemplate = { path: './templates/notExistingTemplate.html' };

        template.save(() => {


            agent.patch('/templates/' + template._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchTemplate)
                .expect(400)
                .end((templateGetErr, templateGetRes) => {

                    // Set assertion
                    templateGetRes.body.should.have.a.property('message', 'There is a problem reading the template source');

                    done(templateGetErr);

                });
        });
    });

    /** DELETE /templates/:templateId **/

    it('should be able to delete a template', (done) => {

        template.save(() => {

            agent
                .delete('/templates/' + template._id)
                .set('Authorization', 'Bearer ' + token)
                .send(template)
                .expect(200)
                .end((templateDeleteErr, templateDeleteRes) => {

                    (templateDeleteRes.headers['cache-control']).should.equal('no-cache, no-store');

                    if (templateDeleteErr) {
                        return done(templateDeleteErr);
                    }

                    Template.find({})
                        .exec((templateFindErr, templateFindRes) => {

                            // Handle templates get error
                            if (templateFindErr) {
                                return done(templateFindErr);
                            }

                            // Set assertions
                            templateFindRes.should.have.a.lengthOf(0);
                            done();

                        });

                });
        });
    });


    it('should not be able to delete a template if no auth token is provided', (done) => {

        template.save(() => {

            agent
                .delete('/templates/' + template._id)
                .expect(401)
                .end((templateDeleteErr, templateDeleteRes) => {

                    // Set message assertion
                    should.exist(templateDeleteRes);
                    (templateDeleteRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    // Handle list save error
                    done(templateDeleteErr);

                });

        });
    });


    it('returns an error if a wrongly formatted _id is provided when retrieving a template', (done) => {
        template.save(() => {
            agent
                .get('/templates/' + 'invalidId')
                .set('Authorization', 'Bearer ' + token)
                .expect(400)
                .end((templateGetErr, templateGetRes) => {

                    // Set message assertion
                    should.exist(templateGetRes);
                    (templateGetRes.body.message).should.equal('Template ID is invalid');

                    done(templateGetErr);

                });

        });
    });

    it('returns an error if an invalid _id is provided when retrieving a template', (done) => {

        let randomId = '55c8861dfdf6f00300b9f89a';

        template.save(() => {
            agent
                .get('/templates/' + randomId)
                .set('Authorization', 'Bearer ' + token)
                .expect(404)
                .end((templateGetErr, templateGetRes) => {

                    // Set message assertion
                    should.exist(templateGetRes);
                    (templateGetRes.body.message).should.equal('Template not found');

                    done(templateGetErr);

                });

        });
    });

    it('returns an error if an invalid jwt is provided', (done) => {

        let randomJWT = 'abcdefghijklmnopqrstuvwxyz';

        template.save(() => {
            agent
                .get('/templates/')
                .set('Authorization', 'Bearer ' + randomJWT)
                .expect(401)
                .end((templateGetErr, templateGetRes) => {

                    // Set message assertion
                    should.exist(templateGetRes);
                    (templateGetRes.body.message).should.equal('Invalid Token');

                    done(templateGetErr);

                });

        });
    });

    it('returns an error if an expired jwt is provided when retrieving a template', (done) => {

        let payload = {
            email: 'abc@ft.com',
            expire: moment().subtract(3, 'hours').unix()
        };

        let expiredJWT = jwt.encode(payload, config.tokenSecret);

        template.save(() => {
            agent
                .get('/templates/')
                .set('Authorization', 'Bearer ' + expiredJWT)
                .expect(401)
                .end((templateGetErr, templateGetRes) => {

                    // Set message assertion
                    should.exist(templateGetRes);
                    (templateGetRes.body.message).should.equal('Token has expired');

                    done(templateGetErr);

                });

        });
    });


    afterEach((done) => {
        Template.remove().exec(done);
    });

});
