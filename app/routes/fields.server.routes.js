'use strict';

const fields = require('../controllers/fields.server.controller');
const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');

module.exports = (app) => {

    app.route('/fields')
        .get(ensureAuthenticated, fields.list)
        .post(ensureAuthenticated, fields.create);

    app.route('/fields/:fieldId')
        .get(ensureAuthenticated, fields.read)
        .patch(ensureAuthenticated, fields.patch)
        .delete(ensureAuthenticated, fields.delete);

    app.param('fieldId', fields.fieldById);

};