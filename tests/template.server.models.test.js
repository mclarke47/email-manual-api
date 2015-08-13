'use strict';

// External modules
const should = require('should');
const mongoose = require('mongoose');
const extend = require('extend');

// Internal Modules
const app = require('../server');

const Field = mongoose.model('Field');
const Template = mongoose.model('Template');

let field, template;


describe('Template Model Unit Tests:', function() {

    beforeEach(function(done) {

        field = new Field ({
            name: 'body',
            type: 'wysiwyg',
            options: []
        });

        field.save(() => {

            template = new Template({
               name: 'Editorial',
               path: '/templates/editorial',
               fields: [field]
            });

            done();
        });

    });


    describe('Method Save', () => {

        it('should be able to save without problems', (done) => {
            return template.save((err) => {
                should.not.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without name', (done) => {

            extend(template , { name: '' });

            return template.save((err) => {
                should.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without path', (done) => {

            extend(template , { path: '' });

            return template.save((err) => {
                should.exist(err);
                done();
            });
        });

    });

    afterEach((done) => {
        Template.remove()
            .exec(() => {
                Field.remove().exec(done);
            });
    });

});

