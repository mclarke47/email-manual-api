'use strict';

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.server.utils');
const images = require('../controllers/images.server.controller.js');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = (app) => {
    app.route('/eme-images')
        /**
         * @api {post} /eme-images Upload an image.
         * @apiVersion 0.0.1
         * @apiName UploadImages
         * @apiGroup Image
         *
         * @apiUse AuthHeader
         *
         * @apiSuccess {String} url The image url.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 201 OK
         *
         * {
             "url": "https://bucket.s3.amazonaws.com/uuid"
         * }
         *
         */
        .post(ensureAuthenticated, upload.single('image'), images.upload)
        /**
         * @api {get} /eme-images Get all the Images.
         * @apiVersion 0.0.1
         * @apiName GetImages
         * @apiGroup Image
         *
         * @apiUse AuthHeader
         *
         *
         * @apiSuccess {Object[]} images The list of Images.
         * @apiSuccess {String} image.url The image url.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *
         * [{
         *    "url": "https://bucket.s3.amazonaws.com/uuid"
         * }]
         *
         *
         */
        .get(ensureAuthenticated, images.list);

};
