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
const User = mongoose.model('User');

let user, token;

// User routes tests
describe('User CRUD tests:', () => {

    beforeEach((done) => {

        user = new User({
            email: 'someuser@ft.com',
            permissions: {
                canDisplayUsers: true
            }
        });

        token = createJWT('abc@ft.com');

        done();

    });

    /** POST /users **/

    it('should be able to save a user', (done) => {
        agent
            .post('/eme-users')
            .set('Authorization', 'Bearer ' + token)
            .send(user)
            .expect(201)
            .end((userSaveErr, userSaveRes) => {

                if (userSaveErr) {
                    return done(userSaveErr);
                }

                (userSaveRes.headers['cache-control']).should.equal('no-cache, no-store');

                User.find({})
                    .exec((userFindErr, userFindRes) => {

                        // Handle users get error
                        if (userFindErr) {
                            return done(userFindErr);
                        }

                        // Set assertions
                        (userFindRes[0].email).should.match(user.email);
                        done();

                    });

            });

    });

    it('should not be able to save a user if no email is provided', (done) => {
        // Invalidate email field
        user.email = '';

        agent.post('/eme-users')
            .set('Authorization', 'Bearer ' + token)
            .send(user)
            .expect(400)
            .end((userSaveErr, userSaveRes) => {

                // Set message assertion
                should.exist(userSaveRes);
                (userSaveRes.body.message).should.equal('User validation failed');

                done(userSaveErr);

            });
    });


    it('should not be able to save a user if no auth token is provided', (done) => {

        agent.post('/eme-users')
            .send(user)
            .expect(401)
            .end((userSaveErr, userSaveRes) => {

                should.exist(userSaveRes);
                (userSaveRes.body.message).should.equal('Please make sure your request has an Authorization header');

                done(userSaveErr);

            });
    });

    /** GET /users **/

    it('should be able to get a list of users', (done) => {

        user.save(() => {

            agent
                .get('/eme-users')
                .set('Authorization', 'Bearer ' + token)
                .end((usersGetErr, usersGetRes) => {

                    // Set assertion
                    (usersGetRes.headers['cache-control']).should.equal('no-cache, no-store');
                    usersGetRes.body.should.have.a.lengthOf(1);

                    done(usersGetErr);
                });

        });
    });

    it('should be able to get a list of users using basic auth', (done) => {

        let auth = "Basic " + new Buffer(config.authUser + ":" + config.authPassword).toString("base64");

        user.save(() => {

            agent
                .get('/eme-users')
                .set('Authorization', auth)
                .end((usersGetErr, usersGetRes) => {

                    // Set assertion
                    usersGetRes.body.should.have.a.lengthOf(1);

                    done(usersGetErr);
                });

        });
    });

    it('should receive an error when the wrong credentials are sent', (done) => {

        let auth = "Basic " + new Buffer(config.authUser + ":" + config.authPassword+'x').toString("base64");

        user.save(() => {

            agent
                .get('/eme-users')
                .set('Authorization', auth)
                .end((usersGetErr, usersGetRes) => {

                    // Set assertion
                    (usersGetRes.body.message).should.equal('Invalid username or password');

                    done(usersGetErr);
                });

        });
    });

    it('should not be able to get a list of users using an unsupported authentication method', (done) => {

        let auth = "Some method";

        user.save(() => {

            agent
                .get('/eme-users')
                .set('Authorization', auth)
                .expect(401)
                .end((usersGetErr, usersGetRes) => {

                    // Set assertion
                    (usersGetRes.body.message).should.equal('Authentication method not supported');

                    done(usersGetErr);
                });

        });
    });


    it('should not be able to get a list of users if no auth token is provided', (done) => {

        user.save(() => {

            agent
                .get('/eme-users')
                .expect(401)
                .end((usersGetErr, usersGetRes) => {

                    should.exist(usersGetRes);
                    (usersGetRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    done(usersGetErr);

                });

        });
    });


    /** GET /users/:userId **/

    it('should be able to get a single user', (done) => {

        user.save(() => {

            agent
                .get('/eme-users/' + user._id)
                .set('Authorization', 'Bearer ' + token)
                .end((userGetErr, userGetRes) => {

                    // Set assertion
                    (userGetRes.headers['cache-control']).should.equal('no-cache, no-store');
                    userGetRes.body.should.have.a.property('email', user.email);

                    done(userGetErr);

                });
        });
    });

    it('should not be able to get a single user if no auth token is provided', (done) => {

        user.save(() => {

            agent
                .get('/eme-users/' + user._id)
                .expect(401)
                .end((userGetErr, userGetRes) => {

                    // Set message assertion
                    should.exist(userGetRes);
                    (userGetRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    done(userGetErr);

                });

        });
    });


    /** PATCH /users/:userId **/

    it('should be able to patch a user', (done) => {

        user.save(() => {
            
            let patchUser = { email: 'abc@ft.com' };
            

            agent
                .patch('/eme-users/' + user._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchUser)
                .expect(200)
                .end((userPatchErr, userPatchRes) => {

                    if (userPatchErr) {
                        done(userPatchErr);
                    }
                    // Set assertions
                    (userPatchRes.headers['cache-control']).should.equal('no-cache, no-store');
                    (userPatchRes.body._id).should.equal(user._id.toString());
                    (userPatchRes.body.email).should.equal(patchUser.email);

                    // Call the assertion callback
                    done(userPatchErr);
                });

        });
    });

    it('should not be able to  patch a user if an empty email is provided', (done) => {

        user.save(() => {

            let patchUser = { email: '' };

            agent
                .patch('/eme-users/' + user._id)
                .set('Authorization', 'Bearer ' + token)
                .send(patchUser)
                .expect(400)
                .end((userPatchErr, userPatchRes) => {

                    // Set message assertion
                    should.exist(userPatchRes);
                    (userPatchRes.body.message).should.equal('Validation failed');

                    // Handle list save error
                    done(userPatchErr);

                });

        });
    });

    it('should not be able to  patch a user if no auth token is provided', (done) => {

        user.save(() => {

            agent
                .patch('/eme-users/' + user._id)
                .expect(401)
                .end((userPatchErr, userPatchRes) => {

                    // Set message assertion
                    should.exist(userPatchRes);
                    (userPatchRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    // Handle list save error
                    done(userPatchErr);

                });

        });
    });

    /** DELETE /users/:userId **/

    it('should be able to delete a user', (done) => {

        user.save(() => {

            agent
                .delete('/eme-users/' + user._id)
                .set('Authorization', 'Bearer ' + token)
                .send(user)
                .expect(200)
                .end((userDeleteErr, userDeleteRes) => {

                    (userDeleteRes.headers['cache-control']).should.equal('no-cache, no-store');

                    if (userDeleteErr) {
                        return done(userDeleteErr);
                    }

                    User.find({})
                        .exec((userFindErr, userFindRes) => {

                            // Handle users get error
                            if (userFindErr) {
                                return done(userFindErr);
                            }

                            // Set assertions
                            userFindRes.should.have.a.lengthOf(0);
                            done();

                        });

                });
        });
    });


    it('should not be able to delete a user if no auth token is provided', (done) => {

        user.save(() => {

            agent
                .delete('/eme-users/' + user._id)
                .expect(401)
                .end((userDeleteErr, userDeleteRes) => {

                    // Set message assertion
                    should.exist(userDeleteRes);
                    (userDeleteRes.body.message).should.equal('Please make sure your request has an Authorization header');

                    // Handle list save error
                    done(userDeleteErr);

                });

        });
    });


    it('returns an error if a wrongly formatted _id is provided when retrieving a user', (done) => {
        user.save(() => {
            agent
                .get('/eme-users/' + 'invalidId')
                .set('Authorization', 'Bearer ' + token)
                .expect(400)
                .end((userGetErr, userGetRes) => {

                    // Set message assertion
                    should.exist(userGetRes);
                    (userGetRes.body.message).should.equal('User ID is invalid');

                    done(userGetErr);

                });

        });
    });

    it('returns an error if an invalid _id is provided when retrieving a user', (done) => {

        let randomId = '55c8861dfdf6f00300b9f89a';

        user.save(() => {
            agent
                .get('/eme-users/' + randomId)
                .set('Authorization', 'Bearer ' + token)
                .expect(404)
                .end((userGetErr, userGetRes) => {

                    // Set message assertion
                    should.exist(userGetRes);
                    (userGetRes.body.message).should.equal('User not found');

                    done(userGetErr);

                });

        });
    });

    it('returns an error if an invalid jwt is provided', (done) => {

        let randomJWT = 'abcdefghijklmnopqrstuvwxyz';

        user.save(() => {
            agent
                .get('/eme-users')
                .set('Authorization', 'Bearer ' + randomJWT)
                .expect(401)
                .end((userGetErr, userGetRes) => {

                    // Set message assertion
                    should.exist(userGetRes);
                    (userGetRes.body.message).should.equal('Invalid Token');

                    done(userGetErr);

                });

        });
    });

    it('returns an error if an expired jwt is provided when retrieving a user', (done) => {

        let payload = {
            email: 'abc@ft.com',
            expire: moment().subtract(3, 'hours').unix()
        };

        let expiredJWT = jwt.encode(payload, config.tokenSecret);

        user.save(() => {
            agent
                .get('/eme-users')
                .set('Authorization', 'Bearer ' + expiredJWT)
                .expect(401)
                .end((userGetErr, userGetRes) => {

                    // Set message assertion
                    should.exist(userGetRes);
                    (userGetRes.body.message).should.equal('Token has expired');

                    done(userGetErr);

                });

        });
    });


    afterEach((done) => {
        User.remove().exec(done);
    });

});
