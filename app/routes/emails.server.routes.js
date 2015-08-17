'use strict';

const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');
const emails = require('../controllers/emails.server.controller');

module.exports = (app) => {

    app.route('/emails')
        .get(ensureAuthenticated, emails.list);
};

