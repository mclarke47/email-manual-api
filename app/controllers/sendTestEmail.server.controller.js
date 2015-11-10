'use strict';

const mongoose = require('mongoose');
const Email = mongoose.model('Email');
const sendClient = require('../services/sendClient.server.services.js');
const logger = require('../../config/logger');


module.exports = (req, res) => {

    let emailId = req.body.email;
    let recipients = req.body.recipients;

    if (!emailId) {
        //Return an error if the email ID is missing
        return res.status(400).send({
            message: 'The request must contain a valid Email ID'
        });
    }

    if (!recipients || !recipients.length) {
        //Return an error if the recipients array is missing or empty
        return res.status(400).send({
            message: 'The request must contain at least a recipient'
        });
    }

    Email.findOne({ _id: emailId })
        .populate('template')
        .exec((err, email) => {

            if (!mongoose.Types.ObjectId.isValid(emailId)) {

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

            else if (!email) {
                return res.status(404).send({
                    message: 'Email not found'
                });
            }

            else {
                //We have successfully retrieved an email
                let body = email.body;
                let subject = email.subject;
                let from = email.template.from;

                Promise.all(recipients.map((to) => sendClient.sendByAddress(emailId, from, to, subject, body)))
                    .then(() => res.json({'messages_delivered': recipients.length }))
                    .catch((err) => {
                        logger.warn(err);
                        return res.status(400).send({
                            message: err.message
                        });
                    });

            }
        });



};