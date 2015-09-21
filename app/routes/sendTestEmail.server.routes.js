'use strict';

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.server.utils');
const sendTestEmail = require('../controllers/sendTestEmail.server.controller.js');

module.exports = (app) => {
    app.route('/send-test-email')
        .post(ensureAuthenticated, sendTestEmail);



};