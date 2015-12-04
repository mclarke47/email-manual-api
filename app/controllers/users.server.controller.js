'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

const User = mongoose.model('User');


/** GET /users **/

exports.list = (req, res) => {



    const options = {};

    User.find(options,  { __v: 0, permissions: 0 })
        .exec((findErr, users) => {
            /* istanbul ignore if */
            if (findErr) {
                return res.status(400).send({
                    message: findErr.message
                });
            }
            else {
                res.json(users);
            }
        });
};


/** POST /users **/

exports.create = (req, res) => {


    let user = new User(req.body);

    user.save((err) => {
        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }
        else {
            res.status(201).json(user);
        }
    });
};


/** GET /users/userId **/

exports.read = (req, res) => {

    let user = req.user;

    res.json(user);

};

/** PATCH /users/userId **/

exports.patch = (req, res) => {

    let userObject = req.user.toObject();
    let requestBody = req.body;

    _.merge(userObject, requestBody);

    User.update({ _id: userObject._id }, userObject, { runValidators: true }, (updateErr) => {
        if (updateErr) {
            return res.status(400).send({
                message: updateErr.message
            });
        }
        else {
            res.json(userObject);
        }
    });
};

exports.delete = function(req, res) {

    let user = req.user;

    User.findOneAndRemove({ _id: user._id}, (removeErr) => {

        /* istanbul ignore if */
        if (removeErr) {
            return res.status(400).send({
                message: removeErr.message
            });
        }
        else {
            res.json(user);
        }
    });
};


exports.userById = (req, res, next, id) => {

    User.findOne({ _id: id })
        .exec((err, user) => {


            if (!mongoose.Types.ObjectId.isValid(id)) {

                return res.status(400).send({
                    message: 'User ID is invalid'
                });
            }
            /* istanbul ignore if */
            if (err) {
                return res.status(400).send({
                    message: err.message
                });
            }

            else if (user) {
                req.user = user;
                next();
            }

            else {
                return res.status(404).send({
                    message: 'User not found'
                });
            }
        });
};