'use strict';

const authGoogle = require('../controllers/authGoogle.server.controller');

module.exports = (app) => {
  app.routes('/auth/google')
    .post(authGoogle.authenticate)
};