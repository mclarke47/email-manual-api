'use strict';

const mongoose = require('mongoose');
const extend = require('extend');

const createJWT = require('../utils/createJWT.server.utils');

const Email = mongoose.model('Email');


/** GET /emails **/

exports.list = (req, res) => {

    Email.find({})
        .populate('template')
        .exec((findErr, emails) => {
            /* istanbul ignore if */
            if (findErr) {
                return res.status(400).send({
                    message: findErr.message
                });
            }
            else {
                let token = createJWT(req.email);
                res.header('X-Auth', token);
                res.json(emails);
            }
        });
};



/** POST /emails **/

exports.create = (req, res) => {
    let email = new Email(req.body);

    email.save((err) => {
        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.status(201).json(email);
        }
    });
};


/** GET /emails/emailId **/

exports.read = (req, res) => {

    let email = req.email.toObject();

    let token = createJWT(req.email);

    res.header('X-Auth', token);

    res.json(email);

};

/** PATCH /emails/emailId **/

exports.patch = (req, res) => {

    let email = req.email;

    email = extend(email, req.body);

    email.save((saveErr) => {
        if (saveErr) {
            return res.status(400).send({
                message: saveErr.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.json(email);
        }
    });
};

exports.delete = function(req, res) {

    let email = req.email;

    email.remove((removeErr) => {

        /* istanbul ignore if */
        if (removeErr) {
            return res.status(400).send({
                message: removeErr.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.json(email);
        }
    });
};


exports.emailById = (req, res, next, id) => {

    Email.findOne({ _id: id })
        .populate('template')
        .exec((err, email) => {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                message: 'Email ID is invalid'
            });
        }
        /* istanbul ignore if */
        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }

        else if (email) {
            req.email = email;
            next();
        }

        else {
            return res.status(404).send({
                message: 'Email not found'
            });
        }
    });
};