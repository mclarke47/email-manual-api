'use strict';

const templates = require('../controllers/templates.server.controller');

module.exports = (app) => {

    app.route('/templates')
        .get(templates.list)
        .post(templates.create);

    app.route('/templates/:templateId')
        .get(templates.read)
        .patch(templates.patch)
        .put(templates.update)
        .delete(templates.delete);

    app.param('templateId', templates.templateById);

};