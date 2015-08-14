'use strict';

const app = require('../server');
const auth = require('../app/controllers/auth.server.controller');
const config = require('../config/config');

const should = require('should');
const sinon      = require('sinon');
const request    = require('request');
const supertest = require('supertest');

const agent = supertest.agent(app);

describe('The /auth endpoint', () => {

    describe('when a valid profile authenticates', () => {
        before((done) => {
            sinon
                .stub(request, 'post')
                .yields(null, null, {access_token: 'token'});
            sinon
                .stub(request, 'get')
                .yields(null, null, {email: 'abc@ft.com'});
            done();
        });

        it('should return a token when a valid profile authenticates', (done) => {

            let postBody = {
                code: 'someCode',
                clientId: 'someClientId',
                redirectUri: 'http://goToSomewhere.com'

            };

            agent
                .post('/auth')
                .send(postBody)
                .expect(200)
                .end((authErr, authRes) => {
                    (authRes.body).should.have.a.property('token');
                    done(authErr);
                });
        });

        after((done) => {
            request.post.restore();
            request.get.restore();
            done();
        });

    });

    describe('when providing invalid data', () => {
        before((done) => {

            sinon
                .stub(request, 'post')
                .yields(null, {statusCode: 400}, {
                    error: 'invalid_client',
                    error_description: 'The OAuth client was not found.'
                }
            );
            done();
        });

        it('should propagate the error', (done) => {


            let postBody = {
                code: 'someCode',
                clientId: 'someClientId',
                redirectUri: 'http://goToSomewhere.com'

            };

            agent
                .post('/auth')
                .send(postBody)
                .expect(400)
                .end((authErr, authRes) => {
                    (authRes.body.message).should.match('invalid_client');
                    done();
                });
        });


        after((done) => {
            request.post.restore();
            done();
        });
    });


    describe('when providing the wrong credentials', () => {

        before((done) => {

            sinon
                .stub(request, 'post')
                .yields(null, null, {access_token: 'token'});
            sinon
                .stub(request, 'get')
                .yields(null,
                {statusCode: 401},
                {
                    "error": {
                        "message": "Invalid Credentials"
                    }
                });
            done();
        });

        it('should return a token when a valid profile authenticates', (done) => {

            let postBody = {
                code: 'someCode',
                clientId: 'someClientId',
                redirectUri: 'http://goToSomewhere.com'

            };

            agent
                .post('/auth')
                .send(postBody)
                .expect(401)
                .end((authErr, authRes) => {
                    (authRes.body.message).should.match('Invalid Credentials');
                    done();
                });
        });

        after((done) => {
            request.post.restore();
            request.get.restore();
            done();
        });

    });

    describe('when an external domains tries to authenticate', () => {

        before((done) => {

            sinon
                .stub(request, 'post')
                .yields(null, null, {access_token: 'token'});
            sinon
                .stub(request, 'get')
                .yields(null, null, {email: 'abc@gmail.com'});

            done();
        });

        it('should return a token when a valid profile authenticates', (done) => {

            let postBody = {
                code: 'someCode',
                clientId: 'someClientId',
                redirectUri: 'http://goToSomewhere.com'

            };

            agent
                .post('/auth')
                .send(postBody)
                .expect(401)
                .end((authErr, authRes) => {
                    (authRes.body.message).should.match('Unauthorized');
                    done();
                });
        });

        after((done) => {
            request.post.restore();
            request.get.restore();
            done();
        });

    });

});