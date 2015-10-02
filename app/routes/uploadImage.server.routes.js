'use strict';

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.server.utils');
const uploadImage = require('../controllers/uploadImage.server.controller');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = (app) => {
    app.route('/upload-image')
        .post(upload.single('image'), uploadImage);

};
