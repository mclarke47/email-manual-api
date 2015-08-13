'use strict';

const templates = require('../controllers/templates.server.controller');
const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');

module.exports = (app) => {

    app.route('/templates')
        .get(ensureAuthenticated, templates.list)
        .post(ensureAuthenticated, templates.create);

    app.route('/templates/:templateId')
        .get(ensureAuthenticated, templates.read)
        .patch(ensureAuthenticated, templates.patch)
        .delete(ensureAuthenticated, templates.delete);

    app.param('templateId', templates.templateById);

};