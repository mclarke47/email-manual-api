'use strict';

const mongoose = require('mongoose');

const Template = mongoose.model('Template');
const createJWT = require('../utils/createJWT.server.utils');
const extend = require('extend');


/** GET /templates **/

exports.list = (req, res) => {

    Template.find({})
        .exec((findErr, templates) => {
            /* istanbul ignore if */
            if (findErr) {
                return res.status(400).send({
                    message: findErr.message
                });
            }
            else {
                let token = createJWT(req.email);
                res.header('X-Auth', token);
                res.json(templates);
            }
        });
};

/** POST /templates **/

exports.create = (req, res) => {
    let template = new Template(req.body);
    template.save((err) => {
        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.status(201).json(template);
        }
    });
};

/** GET /templates/templateId **/

exports.read = (req, res) => {
    let token = createJWT(req.email);
    res.header('X-Auth', token);
    res.json(req.template);
};


/** PATCH /templates/templateId **/

exports.patch = (req, res) => {

    let template = req.template;

    template = extend(template, req.body);

    template.save((saveErr) => {
        if (saveErr) {
            return res.status(400).send({
                message: saveErr.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.json(template);
        }
    });
};

/** DELETE /templates/templateId **/

exports.delete = function(req, res) {

    let template = req.template;

    template.remove((removeErr) => {

        /* istanbul ignore if */
        if (removeErr) {
            return res.status(400).send({
                message: removeErr.message
            });
        }
        else {
            let token = createJWT(req.email);
            res.header('X-Auth', token);
            res.json(template);
        }
    });
};

exports.templateById = (req, res, next, id) => {

    Template.findOne({ _id: id })
        .populate('fields')
        .exec((err, template) => {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                message: 'Template ID is invalid'
            });
        }
        /* istanbul ignore if */
        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }

        else if (template) {
            req.template = template;
            next();
        }

        else {
            return res.status(404).send({
                message: 'Template not found'
            });
        }
    });
};