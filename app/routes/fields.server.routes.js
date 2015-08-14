'use strict';

const fields = require('../controllers/fields.server.controller');
const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');

module.exports = (app) => {


    /**
     * @apiDefine FieldParams
     *
     * @apiParam {String} name The name of the Field.
     * @apiParam {String} type The type of the Field.
     * @apiParam {[Object[]]} options A list of field-related options.
     *
     */

    /**
     * @apiDefine FieldResponse
     * @apiSuccess {ObjectId} _id The Field Object ID.
     * @apiSuccess {String} name  The name of the Field.
     * @apiSuccess {String} type  The type of the Field.
     * @apiSuccess {Object[]} options   A list of field-related options.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     {
         "_id":"55cde84b310d0203006256ac",
         "name":"subject","type":"textbox",
         "options":[]
     }
     *
     */

    /**
     * @apiDefine FieldValidationError
     *
     * @apiError BadRequest Field validation failed.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "message": "Field validation failed"
     *     }
     */


    /**
     * @apiDefine FieldNotFoundError
     *
     * @apiError NotFound Field not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "message": "Field not found"
     *     }
     */

    app.route('/fields')
        /**
         * @api {get} /fields Get all the Fields.
         * @apiVersion 0.0.1
         * @apiName GetFields
         * @apiGroup Field
         *
         * @apiUse AuthHeader
         *
         * @apiSuccess {Object[]} fields The list of Fields.
         * @apiSuccess {ObjectId} field._id The Field Object ID.
         * @apiSuccess {String} field.name  The name of the Field.
         * @apiSuccess {String} field.type  The type of the Field.
         * @apiSuccess {Object[]} field.options   An list of Field options.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *
         [{
             "_id":"55cde84b310d0203006256ac",
             "name":"subject","type":"textbox",
             "options":[]
         }]
         *
         *
         */
        .get(ensureAuthenticated, fields.list)

        /**
         * @api {post} /fields/ Create a Field.
         * @apiVersion 0.0.1
         * @apiName CreateField
         * @apiGroup Field
         *
         * @apiUse AuthHeader
         *
         * @apiUse FieldParams
         *
         * @apiUse FieldResponse
         *
         * @apiUse FieldValidationError
         */
        .post(ensureAuthenticated, fields.create);

    app.route('/fields/:fieldId')

        /**
         * @api {get} /fields/:fieldId Get Field information.
         * @apiVersion 0.0.1
         * @apiName GetField
         * @apiGroup Field
         *
         * @apiUse AuthHeader
         *
         * @apiParam {ObjectId} fieldId Field unique _id.
         *
         * @apiUse FieldResponse
         *
         * @apiUse FieldNotFoundError
         *
         */
        .get(ensureAuthenticated, fields.read)

        /**
         * @api {patch} /fields/:fieldId Update Field information.
         * @apiVersion 0.0.1
         * @apiName PatchField
         * @apiGroup Field
         *
         * @apiUse AuthHeader
         *
         * @apiParam {ObjectId} fieldId Field unique _id.
         * @apiUse FieldParams
         *
         * @apiUse FieldResponse
         *
         * @apiUse FieldNotFoundError
         * @apiUse FieldValidationError
         *
         */
        .patch(ensureAuthenticated, fields.patch)

        /**
         * @api {delete} /fields/:fieldId Delete Field information.
         * @apiVersion 0.0.1
         * @apiName DeleteField
         * @apiGroup Field
         *
         * @apiUse AuthHeader
         *
         * @apiParam {ObjectId} fieldId Field unique _id.
         * @apiUse FieldResponse
         *
         * @apiUse FieldNotFoundError
         *
         */
        .delete(ensureAuthenticated, fields.delete);

    app.param('fieldId', fields.fieldById);

};