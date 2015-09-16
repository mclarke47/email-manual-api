'use strict';

const mongoose = require('mongoose');
const fs = require('fs');
const extend = require('extend');

const Template = mongoose.model('Template');


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
                res.json(templates);
            }
        });
};

/** POST /templates **/

exports.create = (req, res) => {

    let template = new Template(req.body);

    fs.readFile(template.path, {encoding: 'utf8'}, (err) => {

        if (err) {
            return res.status(400).send({
                message: 'There is a problem reading the template source'
            });
        }


        template.save((err) => {
            if (err) {
                return res.status(400).send({
                    message: err.message
                });
            }
            else {
                return res.status(201).json(template);
            }
        });

    });

};

/** GET /templates/templateId **/

exports.read = (req, res) => {

    let template = req.template.toObject();

    fs.readFile(template.path, {encoding: 'utf8'}, (err, fileContent) => {

        if (err) {
            return res.status(400).send({
                message: 'There is a problem reading the template source'
            });
        }

        template.body = fileContent;

        res.json(template);
    });

};


/** PATCH /templates/templateId **/

exports.patch = (req, res) => {

    let template = req.template;

    template = extend(template, req.body);

    fs.readFile(template.path, {encoding: 'utf8'}, (err) => {

        if (err) {
            return res.status(400).send({
                message: 'There is a problem reading the template source'
            });
        }

        template.save((saveErr) => {
            if (saveErr) {
                return res.status(400).send({
                    message: saveErr.message
                });
            }
            else {
                res.json(template);
            }
        });
    });
};

/** DELETE /templates/templateId **/

exports.delete = function(req, res) {

    let template = req.template;

    Template.findOneAndRemove({ _id: template._id },(removeErr) => {

        /* istanbul ignore if */
        if (removeErr) {
            return res.status(400).send({
                message: removeErr.message
            });
        }
        else {
            res.json(template);
        }
    });
};

exports.templateById = (req, res, next, id) => {

    Template.findOne({ _id: id }, (err, template) => {

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