'use strict';

// External modules
const should = require('should');
const mongoose = require('mongoose');
const extend = require('extend');

// Internal Modules
const app = require('../server');

const Template = mongoose.model('Template');
const Email = mongoose.model('Email');


let template, email;


describe('Template Model Unit Tests:', function() {

    beforeEach(function(done) {

        let field = {
            label: 'Body',
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


    describe('Method Save', () => {

        it('should be able to save without problems', (done) => {
            return email.save((err) => {
                should.not.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without template', (done) => {

            extend(email , { template: '' });

            return email.save((err) => {
                should.exist(err);
                done();
            });
        });

    });

    afterEach((done) => {
        Email.remove()
            .exec(() => Template.remove().exec(done));
    });

});

