'use strict';

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.server.utils');
const images = require('../controllers/images.server.controller.js');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = (app) => {
    app.route('/images')
        .post(ensureAuthenticated, upload.single('image'), images.upload)
        .get(ensureAuthenticated, images.list);

};
