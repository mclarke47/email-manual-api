'use strict';

const auth = require('../controllers/auth.server.controller');

module.exports = (app) => {

    app.route('/auth')
    .post(auth.authenticate);
};