'use strict';

const mongoose = require('mongoose');
const extend = require('extend');
const htmlToText = require('html-to-text');
const fs = require('fs');

const Email = mongoose.model('Email');


/** GET /emails **/

exports.list = (req, res) => {

    /**
     * The "pagination" filter
     */
    const page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    const perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 10);

    let options = {};

    /**
     * The "template" filter
     */
    if (req.query.t) {
        let templates = req.query.t.split(',');
        let or = templates.map((template) => {
            return { template: template };
        });
        options.$or = or;
    }

    /**
     * The "dirty" filter
     */
    if (req.query.dirty === '' || req.query.dirty === 'true') {
        options.dirty = true;
    } else if (req.query.dirty === 'false') {
        options.dirty = false;
    }

    /**
     * The "sent" filter
     */
    if (req.query.sent === '' || req.query.sent === 'true') {
        options.sent = true;
    } else if (req.query.sent === 'false') {
        options.sent = false;
    }

    /**
     * The "toSubEdit" filter
     */
    if (req.query.toSubEdit === '' || req.query.toSubEdit === 'true') {
        options.toSubEdit = true;
    } else if (req.query.toSubEdit === 'false') {
        options.toSubEdit = false;
    }

    /**
     * The "subEdited" filter
     */
    if (req.query.subEdited === '' || req.query.subEdited === 'true') {
        options.subEdited = true;
    } else if (req.query.subEdited === 'false') {
        options.subEdited = false;
    }

    /**
     * The "toSend" filter
     */
    if (req.query.toSend === '' || req.query.toSend === 'true') {
        options.sent = false;
        options.failed = false;
        options.pending = false;
        options.sendTime = { "$lte": Date.now() };
    }

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    Email.count(options, (countErr, count) => {

        res.header('X-Total-Count', count);


        Email.find(options,  { __v: 0, body: 0 })
            .sort({ updatedOn: -1 })
            .limit(perPage)
            .skip(perPage * page)
            .populate('template')
            .exec((findErr, emails) => {
                /* istanbul ignore if */
                if (findErr) {
                    return res.status(400).send({
                        message: findErr.message
                    });
                }
                else {
                    res.json(emails);
                }
            });
    });
};



/** POST /emails **/

exports.create = (req, res) => {


    // If sendTime is 'now', we assign the current datetime to the property
    if (req.body.sendTime && req.body.sendTime.toLocaleLowerCase() === 'now') {
        req.body.sendTime = Date.now();
    }

    let email = new Email(req.body);

    if (email.body && email.body.plain) {
        //Plain is a read-only property, it cannot be overridden by the client
        return res.status(400).send({
            message: 'The plain text body is read-only, it cannot be overridden'
        });

    }

    if (email.body && email.body.html) {

        // If there is any html body, add the plaintext body

        let plain = htmlToText.fromString(email.body.html, {
            tables: true
        });

        email.body.plain = plain;

    }

    email.save((err) => {
        if (err) {
            return res.status(400).send({
                message: err.message
            });
        }
        else {
            res.status(201).json(email);
        }
    });
};


/** GET /emails/emailId **/

exports.read = (req, res) => {

    let email = req.email.toObject();

    fs.readFile(email.template.path, {encoding: 'utf8'}, (err, fileContent) => {

        /* istanbul ignore if - already tested in templates */
        if (err) {
            return res.status(400).send({
                message: 'There is a problem reading the template source'
            });
        }

        email.template.body = fileContent;

        res.json(email);

    });
};

/** PATCH /emails/emailId **/

exports.patch = (req, res) => {

    let email = req.email;
    let requestBody = req.body;

    // If sendTime is 'now', we assign the current datetime to the property
    if (requestBody.sendTime && requestBody.sendTime.toLocaleLowerCase() === 'now') {
        requestBody.sendTime = Date.now();
    }

    if (email.sent) {
        // If the email has been sent, it cannot be patched
        return res.status(400).send({
            message: 'Cannot patch. The email has already been sent'
        });
    }

    if (email.sendTime && !allowedPatchWhenScheduled(requestBody)) {
        // If the email has been scheduled, we can only patch the sendTime or sent property
        return res.status(400).send({
            message: 'The email is already scheduled, the required property cannot be edited'
        });
    }

    if (requestBody.body && requestBody.body.plain) {
        //Plain is a read-only property, it cannot be overridden by the client
        return res.status(400).send({
            message: 'The plain text body is read-only, it cannot be overridden'
        });

    }

    if (requestBody.body && requestBody.body.html) {

        // If there is any html body, update the plaintext body

        let plain = htmlToText.fromString(requestBody.body.html, {
            tables: true
        });

        requestBody.body.plain = plain;

    }

    // We set the email as dirty unless the client specifies that the email is not dirty
    if (requestBody.dirty !== false) {
        requestBody.dirty = true;
    }

    let emailObj = email.toObject();

    extend(emailObj, requestBody);


    emailObj.updatedOn = Date.now();

    Email.update({ _id: emailObj._id }, emailObj, { runValidators: true }, (updateErr) => {
        if (updateErr) {
            return res.status(400).send({
                message: updateErr.message
            });
        }
        else {
            return res.json(emailObj);
        }
    });

};

exports.delete = function(req, res) {

    let email = req.email;

    Email.findOneAndRemove({ _id: email._id}, (removeErr) => {

        /* istanbul ignore if */
        if (removeErr) {
            return res.status(400).send({
                message: removeErr.message
            });
        }
        else {
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


function allowedPatchWhenScheduled (requestBody) {
    // If the email has been scheduled, we only allow a PATCH with a single property.
    // This property can either be 'sent' or 'sendTime' of 'failed'

    let keys = Object.keys(requestBody);

    return (keys.length === 1 && ['sendTime', 'sent', 'failed'].indexOf(keys[0]) > -1);

}
