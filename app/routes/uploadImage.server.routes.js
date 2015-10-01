'use strict';

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.server.utils');
const uploadImage = require('../controllers/uploadImage.server.controller');

module.exports = (app) => {
    app.route('/upload-image')
        .post(ensureAuthenticated, uploadImage);

};
