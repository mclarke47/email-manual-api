'use strict';

const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');
const sendTestEmail = require('../utils/sendTestEmail.server.utils');

module.exports = (app) => {
    app.route('/send-test-email')
        .post(ensureAuthenticated, sendTestEmail);



};