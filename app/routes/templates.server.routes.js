'use strict';

const templates = require('../controllers/templates.server.controller');
const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');

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
     * @apiParam {ObjectId} _id  The _id of the Template.
     * @apiParam {String} name The name of the Template.
     * @apiParam {String} path The path of the Template.
     * @apiParam {[ObjectId[]]} fields An ordered list of Fields for the template.
     *
     */

    /**
    * @apiDefine TemplateResponse
    * @apiSuccess {ObjectId} _id The Template Object ID.
    * @apiSuccess {String} name  The name of the Template.
    * @apiSuccess {String} path  The path of the Template.
    * @apiSuccess {ObjectId[]} fields   An ordered list of Field Ids.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *
    [{
        "_id":"55ccb875090bff0300e78b63",
        "name":"Breaking News",
        "path":"templates/breaking-news",
        "__v":0,
        "fields":[

        ]
    },
        {
            "_id":"55ccb821090bff0300e78b62",
            "name":"Editorial",
            "path":"templates/editorial",
            "__v":1,
            "fields":[
                "55cde84b310d0203006256ac",
                "55cde85f310d0203006256ad"
            ]
        }]
     *
     */

    app.route('/templates')
        /**
         * @api {get} /templates/ Get all the Templates.
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
                "fields":[

                ]
             },
         {
            "_id":"55ccb821090bff0300e78b62",
            "name":"Editorial",
            "path":"templates/editorial",
            "__v":1,
            "fields":[
               "55cde84b310d0203006256ac",
               "55cde85f310d0203006256ad"
            ]
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
         * @apiError ValidationError The posted User object is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
             *       "message": "uuid cannot be blank"
             *     }
         */

        .post(ensureAuthenticated, templates.create);

    app.route('/templates/:templateId')
        .get(ensureAuthenticated, templates.read)
        .patch(ensureAuthenticated, templates.patch)
        .delete(ensureAuthenticated, templates.delete);

    app.param('templateId', templates.templateById);

};