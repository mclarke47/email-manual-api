'use strict';

// External modules
const should = require('should');
const mongoose = require('mongoose');
const extend = require('extend');

// Internal Modules
const app = require('../server');

const User = mongoose.model('User');


let user;


describe('User Model Unit Tests:', function() {

    beforeEach(function(done) {

        user = new User({
            email: 'someuser@ft.com',
            permissions: {
                canDisplayUsers: true
            }
        });

        done();


    });


    describe('Method Save', () => {

        it('should be able to save without problems', (done) => {
            return user.save((err) => {
                should.not.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without email', (done) => {

            extend(user , { email: '' });

            return user.save((err) => {
                should.exist(err);
                done();
            });
        });

    });

    afterEach((done) => {
        User.remove()
            .exec(done);
    });

});

