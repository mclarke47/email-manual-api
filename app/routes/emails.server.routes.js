'use strict';

const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');
const emails = require('../controllers/emails.server.controller');

module.exports = (app) => {

    app.route('/emails')
        .get(ensureAuthenticated, emails.list)
        .post(ensureAuthenticated, emails.create);

    app.route('/emails/:emailId')
        .get(ensureAuthenticated, emails.read)
        .patch(ensureAuthenticated, emails.patch)
        .delete(ensureAuthenticated, emails.delete);

    app.param('emailId', emails.emailById);

};
