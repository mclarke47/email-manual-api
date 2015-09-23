'use strict';

// Our modules
const app = require('../server');
const createJWT = require('../app/utils/createJWT.server.utils');
const config = require('../config/config');
const sendClient = require('../app/services/sendClient.server.services.js');

// External modules
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const moment = require('moment');
const sinon      = require('sinon');

const agent = request.agent(app);

// Models
const Template = mongoose.model('Template');
const Email = mongoose.model('Email');

let recipients, field, template, email, token;

describe('Send Test Email tests:', () => {

    beforeEach((done) => {

        recipients = ['daniele.zanni@ft.com'];

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
                address: 'email@ft.com',
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
                body: {
                    plain: 'Some text',
                    html: '<p>Some text</p>'
                },
                createdOn: Date.now()
            });

            email.save(done);

        });

    });

    it('should be able to send a test email', (done) => {

        sinon
            .stub(sendClient, 'sendByAddress', () => Promise.resolve({}));

        agent
            .post('/send-test-email')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: email._id,
                recipients
            })
            .expect(200)
            .end((sendErr, sendRes) => {

                if (sendErr) {
                    return done(sendErr);
                }

                (sendRes.headers['cache-control']).should.equal('no-cache, no-store');
                (sendRes.body.messages_delivered).should.equal(1);

                done();

            });


    });

    it('should return an error if the email could not be sent by the underlying service', (done) => {

        sinon
            .stub(sendClient, 'sendByAddress', () => Promise.reject({ message: 'Some error'}));

        agent
            .post('/send-test-email')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: email._id,
                recipients
            })
            .expect(400)
            .end((sendErr, sendRes) => {

                if (sendErr) {
                    return done(sendErr);
                }

                (sendRes.headers['cache-control']).should.equal('no-cache, no-store');
                (sendRes.body.message).should.match('Some error');

                done();

            });


    });

    it('should return an error if no email ID is provided', (done) => {

        agent
            .post('/send-test-email')
            .set('Authorization', 'Bearer ' + token)
            .send({
                recipients
            })
            .expect(400)
            .end((sendErr, sendRes) => {

                if (sendErr) {
                    return done(sendErr);
                }

                (sendRes.headers['cache-control']).should.equal('no-cache, no-store');
                (sendRes.body.message).should.match('The request must contain a valid Email ID');

                done();

            });


    });

    it('should return an error if no recipient is provided', (done) => {

        agent
            .post('/send-test-email')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: email._id
            })
            .expect(400)
            .end((sendErr, sendRes) => {

                if (sendErr) {
                    return done(sendErr);
                }

                (sendRes.headers['cache-control']).should.equal('no-cache, no-store');
                (sendRes.body.message).should.match('The request must contain at least a recipient');

                done();

            });


    });

    it('should return an error if no valid email ID is provided', (done) => {

        agent
            .post('/send-test-email')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: 'abcd',
                recipients
            })
            .expect(400)
            .end((sendErr, sendRes) => {

                if (sendErr) {
                    return done(sendErr);
                }

                (sendRes.headers['cache-control']).should.equal('no-cache, no-store');
                (sendRes.body.message).should.match('Email ID is invalid');

                done();

            });


    });

    it('should return an error if no existing email ID is provided', (done) => {

        agent
            .post('/send-test-email')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: '560148421142a603009d1356',
                recipients
            })
            .expect(404)
            .end((sendErr, sendRes) => {

                if (sendErr) {
                    return done(sendErr);
                }

                (sendRes.headers['cache-control']).should.equal('no-cache, no-store');
                (sendRes.body.message).should.match('Email not found');

                done();

            });

    });

    afterEach((done) => {

        if (sendClient.sendByAddress.restore) {
            sendClient.sendByAddress.restore();
        }

        Email.remove()
            .exec(() => Template.remove().exec(done));
    });

});