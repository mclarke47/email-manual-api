'use strict';

const auth = require('../controllers/auth.server.controller');

module.exports = (app) => {

    app.route('/eme-auth')
    .post(auth.authenticate);
};
