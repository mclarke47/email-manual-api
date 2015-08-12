'use strict';

const authGoogle = require('../controllers/authGoogle.server.controller');

module.exports = (app) => {

    app.route('/auth/google')
    .post(authGoogle.authenticate)
};