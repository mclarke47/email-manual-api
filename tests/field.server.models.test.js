'use strict';

// External modules
const should = require('should');
const mongoose = require('mongoose');
const extend = require('extend');

// Internal Modules
const app = require('../server');

const Field = mongoose.model('Field');

let field;


describe('Field Model Unit Tests:', function() {

    beforeEach(function(done) {

        field = new Field ({
            name: 'body',
            type: 'wysiwyg',
            options: []
        });

        done();

    });


    describe('Method Save', () => {

        it('should be able to save without problems', (done) => {
            field.save((err) => {
                should.not.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without name', (done) => {

            extend(field , { name: '' });

            field.save((err) => {
                should.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without type', (done) => {

            extend(field , { type: '' });

            field.save((err) => {
                should.exist(err);
                done();
            });
        });

        it('should throw an error trying to save with unsupported type', (done) => {

            extend(field , { type: 'unsupportedType' });

            field.save((err) => {
                should.exist(err);
                done();
            });
        });

    });

    afterEach((done) => Field.remove().exec(done));

});

