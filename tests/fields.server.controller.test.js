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
const Field = mongoose.model('Field');

let field, token;

// Field routes tests
describe('Field CRUD tests:', () => {

    beforeEach((done) => {

        field = new Field ({
            name: 'body',
            type: 'wysiwyg',
            options: []
        });

        token = createJWT('abc@ft.com');

        done();

    });

    it('should be able to save a field', (done) => {
        agent
            .post('/fields')
            .set('Authorization', 'Bearer ' + token)
            .send(field)
            .expect(201)
            .end((fieldSaveErr) => {

                if (fieldSaveErr) {
                    return done(fieldSaveErr);
                }

                Field.find({})
                    .exec((fieldFindErr, fieldFindRes) => {

                        // Handle fields GET error
                        if (fieldFindErr) {
                            return done(fieldFindErr);
                        }

                        // Set assertions
                        (fieldFindRes[0].name).should.match(field.name);
                        (fieldFindRes[0].type).should.match(field.type);

                        done();

                    });

            });

    });

    it('should not be able to save a field if no name is provided', (done) => {
        // Invalidate name field
        field.name = '';

        agent.post('/fields')
            .set('Authorization', 'Bearer ' + token)
            .send(field)
            .expect(400)
            .end((fieldSaveErr, fieldSaveRes) => {

                // Set message assertion
                should.exist(fieldSaveRes);
                (fieldSaveRes.body.message).should.equal('Field validation failed');

                done(fieldSaveErr);

            });
    });


    it('should not be able to save a field if no auth token is provided', (done) => {

        agent.post('/fields')
            .send(field)
            .expect(401)
            .end((fieldSaveErr, fieldSaveRes) => {

                should.exist(fieldSaveRes);
                (fieldSaveRes.body.message).should.equal('Please make sure your request has an Authorization header');

                done(fieldSaveErr);

            });
    });


    it('should be able to get a list of fields', (done) => {

        field.save(() => {

            agent
                .get('/fields')
                .set('Authorization', 'Bearer ' + token)
                .end((fieldsGetErr, fieldsGetRes) => {

                    // Set assertion
                    fieldsGetRes.body.should.have.a.lengthOf(1);

                    done(fieldsGetErr);
                });

        });
    });


    it('should not be able to get a list of fields if no auth token is provided', (done) => {

        field.save(() => {

            agent
                .get('/fields')
                .expect(401)
                .end((fieldsGetErr, fieldsGetRes) => {

                    should.exist(fieldsGetRes);
                    (fieldsGetRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    done(fieldsGetErr);

                });

        });
    });

    it('should be able to get a single field', (done) => {

        field.save(() => {

            agent
                .get('/fields/' + field._id)
                .set('Authorization', 'Bearer ' + token)
                .end((fieldGetErr, fieldGetRes) => {

                    // Set assertion
                    fieldGetRes.body.should.have.a.property('name', field.name);

                    done(fieldGetErr);

                });
        });
    });

    it('should not be able to get a single field if no auth token is provided', (done) => {

        field.save(() => {

            agent
                .get('/fields/' + field._id)
                .expect(401)
                .end((fieldGetErr, fieldGetRes) => {

                    // Set message assertion
                    should.exist(fieldGetRes);
                    (fieldGetRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    done(fieldGetErr);

                });

        });
    });


    it('should be able to patch a field', (done) => {

        field.save(() => {
            
            let patchField = { name: 'A new name' };
            

            agent
                .patch('/fields/' + field._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchField)
                .expect(200)
                .end((fieldPatchErr, fieldPatchRes) => {

                    if (fieldPatchErr) {
                        done(fieldPatchErr);
                    }

                    // Set assertions
                    (fieldPatchRes.body._id).should.equal(field._id.toString());
                    (fieldPatchRes.body.name).should.equal(patchField.name);

                    // Call the assertion callback
                    done(fieldPatchErr);
                });

        });
    });

    it('should not be able to  patch a field if an empty name is provided', (done) => {

        field.save(() => {

            let patchField = { name: '' };

            agent
                .patch('/fields/' + field._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchField)
                .expect(400)
                .end((fieldPatchErr, fieldPatchRes) => {

                    // Set message assertion
                    should.exist(fieldPatchRes);
                    (fieldPatchRes.body.message).should.equal('Field validation failed');

                    // Handle list save error
                    done(fieldPatchErr);

                });

        });
    });

    it('should not be able to  patch a field if no auth token is provided', (done) => {

        field.save(() => {

            agent
                .patch('/fields/' + field._id)
                .expect(401)
                .end((fieldPatchErr, fieldPatchRes) => {

                    // Set message assertion
                    should.exist(fieldPatchRes);
                    (fieldPatchRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    // Handle list save error
                    done(fieldPatchErr);

                });

        });
    });

    it('should be able to delete a field', (done) => {

        field.save(() => {

            agent
                .delete('/fields/' + field._id)
                .set('Authorization', 'Bearer ' + token)
                .send(field)
                .expect(200)
                .end((fieldSaveErr) => {

                    if (fieldSaveErr) {
                        return done(fieldSaveErr);
                    }

                    Field.find({})
                        .exec((fieldFindErr, fieldFindRes) => {

                            // Handle fields get error
                            if (fieldFindErr) {
                                return done(fieldFindErr);
                            }

                            // Set assertions
                            fieldFindRes.should.have.a.lengthOf(0);
                            done();

                        });

                });
        });
    });


    it('should not be able to delete a field if no auth token is provided', (done) => {

        field.save(() => {

            agent
                .delete('/fields/' + field._id)
                .expect(401)
                .end((fieldDeleteErr, fieldDeleteRes) => {

                    // Set message assertion
                    should.exist(fieldDeleteRes);
                    (fieldDeleteRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    // Handle list save error
                    done(fieldDeleteErr);

                });

        });
    });


    it('returns an error if an invalid _id is provided', (done) => {
        field.save(() => {
            agent
                .get('/fields/' + 'invalidId')
                .set('Authorization', 'Bearer ' + token)
                .expect(400)
                .end((fieldGetErr, fieldGetRes) => {

                    // Set message assertion
                    should.exist(fieldGetRes);
                    (fieldGetRes.body.message).should.equal('Field ID is invalid');

                    done(fieldGetErr);

                });

        });
    });

    it('returns an error if an invalid _id is provided', (done) => {

        let randomId = '55c8861dfdf6f00300b9f89a';

        field.save(() => {
            agent
                .get('/fields/' + randomId)
                .set('Authorization', 'Bearer ' + token)
                .expect(404)
                .end((fieldGetErr, fieldGetRes) => {

                    // Set message assertion
                    should.exist(fieldGetRes);
                    (fieldGetRes.body.message).should.equal('Field not found');

                    done(fieldGetErr);

                });

        });
    });

    it('returns an error if an invalid jwt is provided', (done) => {

        let randomJWT = 'abcdefghijklmnopqrstuvwxyz';

        field.save(() => {
            agent
                .get('/fields/')
                .set('Authorization', 'Bearer ' + randomJWT)
                .expect(401)
                .end((fieldGetErr, fieldGetRes) => {

                    // Set message assertion
                    should.exist(fieldGetRes);
                    (fieldGetRes.body.message).should.equal('Invalid Token');

                    done(fieldGetErr);

                });

        });
    });

    it('returns an error if an expired jwt is provided', (done) => {

        let payload = {
            email: 'abc@ft.com',
            expire: moment().subtract(3, 'hours').unix()
        };

        let expiredJWT = jwt.encode(payload, config.tokenSecret);

        field.save(() => {
            agent
                .get('/fields/')
                .set('Authorization', 'Bearer ' + expiredJWT)
                .expect(401)
                .end((fieldGetErr, fieldGetRes) => {

                    // Set message assertion
                    should.exist(fieldGetRes);
                    (fieldGetRes.body.message).should.equal('Token has expired');

                    done(fieldGetErr);

                });

        });
    });



    afterEach((done) => {
        Field.remove()
            .exec(() => {
                Field.remove().exec(done);
            });
    });

});
