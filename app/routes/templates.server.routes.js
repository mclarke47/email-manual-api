'use strict';

const templates = require('../controllers/templates.server.controller');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated.server.utils');

module.exports = (app) => {

    /**
     * @apiDefine AuthHeader
     *
     * @apiHeader {String} Authorization Token.
     *
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "Authorization": "12234fdsfsdgdfdv567890dfdsggfsdfdsg234567890"
     *     }
     */


    /**
     * @apiDefine TemplateParams
     *
     * @apiParam {String} name The name of the Template.
     * @apiParam {String} path The path of the Template.
     * @apiParam {[ObjectId[]} fields An ordered list of Fields for the template.
     * @apiParam {String} field.name A unique name for the field in the template.
     * @apiParam {String="textbox","wysiwyg"} field.type A type for the field.
     */

    /**
    * @apiDefine TemplateResponse
    * @apiSuccess {ObjectId} _id The Template Object ID.
    * @apiSuccess {String} name  The name of the Template.
    * @apiSuccess {String} path  The path of the Template.
    * @apiSuccess {Object[]} fields   An ordered list of Fields.
    * @apiSuccess {String} field.name A unique name for the field in the template.
    * @apiSuccess {String="textbox","wysiwyg"} field.type A type for the field.    * @apiSuccess {String} body The template body from the file.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *
    {
        "_id":"55ccb875090bff0300e78b63",
        "name":"Breaking News",
        "path":"templates/breaking-news",
        "__v":0,
        "fields":[],
        "body": "<html>\n    <head></head>\n    <body>\n        <p>This is an example template.</p>\n    </body>\n</html>"
    }
    *
    */

    /**
     * @apiDefine TemplateValidationError
     *
     * @apiError BadRequest Template validation failed.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "message": "Template validation failed"
     *     }
     */


    /**
     * @apiDefine TemplateNotFoundError
     *
     * @apiError NotFound Template not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "message": "Template not found"
     *     }
     */

    app.route('/templates')
        /**
         * @api {get} /templates Get all the Templates.
         * @apiVersion 0.0.1
         * @apiName GetTemplates
         * @apiGroup Template
         *
         * @apiUse AuthHeader
         *
         * @apiSuccess {Object[]} templates The list of Templates.
         * @apiSuccess {ObjectId} template._id The Template Object ID.
         * @apiSuccess {String} template.name  The name of the Template.
         * @apiSuccess {String} template.path  The path of the Template.
         * @apiSuccess {Object[]} template.fields   An ordered list of Fields.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *
         [{
                "_id":"55ccb875090bff0300e78b63",
                "name":"Breaking News",
                "path":"templates/breaking-news",
                "__v":0,
                "fields":[]
             },
         {
            "_id":"55ccb821090bff0300e78b62",
            "name":"Editorial",
            "path":"templates/editorial",
            "__v":1,
            "fields":[{
                "name": "heading",
                "type": "textbox"
            }]
         }]
         *
         *
         */
        .get(ensureAuthenticated, templates.list)

        /**
         * @api {post} /templates/ Create a Template.
         * @apiVersion 0.0.1
         * @apiName CreateTemplate
         * @apiGroup Template
         *
         * @apiUse AuthHeader
         *
         * @apiUse TemplateParams
         *
         * @apiUse TemplateResponse
         *
         * @apiUse TemplateValidationError
         */
        .post(ensureAuthenticated, templates.create);

    app.route('/templates/:templateId')

        /**
         * @api {get} /templates/:templateId Get Template information.
         * @apiVersion 0.0.1
         * @apiName GetTemplate
         * @apiGroup Template
         *
         * @apiUse AuthHeader
         *
         * @apiParam {ObjectId} templateId Template unique _id.
         *
         * @apiUse TemplateResponse
         *
         * @apiUse TemplateNotFoundError
         *
         */
        .get(ensureAuthenticated, templates.read)


        /**
         * @api {patch} /templates/:templateId Update Template information.
         * @apiVersion 0.0.1
         * @apiName PatchTemplate
         * @apiGroup Template
         *
         * @apiUse AuthHeader
         *
         * @apiParam {ObjectId} templateId Template unique _id.
         * @apiUse TemplateParams
         *
         * @apiUse TemplateResponse
         *
         * @apiUse TemplateNotFoundError
         * @apiUse TemplateValidationError
         *
         */
        .patch(ensureAuthenticated, templates.patch)

        /**
         * @api {delete} /templates/:templateId Delete Template information.
         * @apiVersion 0.2.0
         * @apiName DeleteTemplate
         * @apiGroup Template
         *
         * @apiUse AuthHeader
         *
         * @apiParam {ObjectId} templateId Template unique _id.
         * @apiUse TemplateResponse
         *
         * @apiUse TemplateNotFoundError
         *
         */
        .delete(ensureAuthenticated, templates.delete);

    app.param('templateId', templates.templateById);

};