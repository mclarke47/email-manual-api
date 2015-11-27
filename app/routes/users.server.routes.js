'use strict';

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.server.utils');
const users = require('../controllers/users.server.controller');

module.exports = (app) => {

    app.route('/users')
        .get(ensureAuthenticated, users.list)
        .post(ensureAuthenticated, users.create);

    app.route('/users/:userId')
        .get(ensureAuthenticated, users.read)
        .patch(ensureAuthenticated, users.patch)
        .delete(ensureAuthenticated, users.delete);

    app.param('userId', users.userById);

};
