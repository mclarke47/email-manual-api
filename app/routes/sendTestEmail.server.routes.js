'use strict';

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.server.utils');
const sendTestEmail = require('../controllers/sendTestEmail.server.controller.js');

module.exports = (app) => {
    app.route('/eme-send-test-email')
        /**
         * @api {post} /eme-send-test-email Send a test email.
         * @apiVersion 0.2.0
         * @apiName SendTestEmail
         * @apiGroup Send
         *
         * @apiUse AuthHeader
         *
         * @apiParam {ObjectId} email The ID of the email to be sent.
         * @apiParam {String[]} recipients The array of FT recipients for the email.
         *
         * @apiSuccess {Number} messages_delivered Number of messages delivered.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 201 OK
         *
         * {
             "messages_delivered": 1
         * }
         *
         */
        .post(ensureAuthenticated, sendTestEmail);



};
