'use strict';

const mongoose = require('mongoose');

const Field = mongoose.model('Field');
const createJWT = require('../utils/createJWT.server.utils');
const extend = require('extend');


/** GET /fields **/

exports.list = (req, res) => {

    Field.find({})
        .exec((findErr, fields) => {
            /* istanbul ignore if */
            if (findErr) {
                return res.status(400).send({
                    message: findErr.message
                });
            }
            else {
                let token = createJWT(req.email);
                res.header('X-Auth', token);
                res.json(fields);
            }
        });
};

/** POST /fields **/

exports.create = (req, res) => {
    let field = new Field(req.body);
    field.save((err) => {
        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.status(201).json(field);
        }
    });
};

/** GET /fields/fieldId **/

exports.read = (req, res) => {
    let token = createJWT(req.email);
    res.header('X-Auth', token);
    res.json(req.field);
};


/** PATCH /fields/fieldId **/

exports.patch = (req, res) => {

    let field = req.field;

    field = extend(field, req.body);

    field.save((saveErr) => {
        if (saveErr) {
            return res.status(400).send({
                message: saveErr.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.json(field);
        }
    });
};

/** DELETE /fields/fieldId **/

exports.delete = function(req, res) {

    let field = req.field;

    field.remove((removeErr) => {

        /* istanbul ignore if */
        if (removeErr) {
            return res.status(400).send({
                message: removeErr.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.json(field);
        }
    });
};

exports.fieldById = (req, res, next, id) => {

    Field.findOne({ _id: id }, (err, field) => {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                message: 'Field ID is invalid'
            });
        }
        /* istanbul ignore if */
        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }

        else if (field) {
            req.field = field;
            next();
        }

        else {
            return res.status(404).send({
                message: 'Field not found'
            });
        }
    });
};