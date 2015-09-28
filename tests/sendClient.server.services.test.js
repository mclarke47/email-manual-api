'use strict';

const sendClient = require('../app/services/sendClient.server.services');

const config = require('../config/config');
const should = require('should');
const nock = require('nock');


describe('The sendClient service', () => {

    let sendEndpointMock, responseBodies, email;

    beforeEach((done) => {


        responseBodies = {
            successPost: {
                results: {
                    total_rejected_recipients: 0,
                    total_accepted_recipients: 1,
                    id: '48130719953288998'
                }
            }
        };

        sendEndpointMock = nock(config.simpleEmailEndpoint);

        sendEndpointMock
            .defaultReplyHeaders({
                'Content-Type':'application/json'
            });

        done();

    });

    describe('The sendByAddress method', () => {

        it('should fulfill a promise when the underlying request succeeds', (done) => {
            sendEndpointMock
                .post('/send-by-address')
                .reply(200, responseBodies.successPost);

            let emailId = '1234567890';

            let from = {
                address: 'FT@ft.com',
                "name": 'FT Breaking News'
            };

            let to = 'someone@ft.com';
            let subject = 'Email Subject';

            let body = {
                plain: 'This is the body',
                html: '<p>This is the body</p>'
            };

            let result = sendClient.sendByAddress(emailId, from, to, subject, body);

            result.then((json) => {
                json.should.have.a.property('results');
                done();
            }).catch(done);

        });

    });


    afterEach((done) => {
        nock.cleanAll();
        done();
    });

});