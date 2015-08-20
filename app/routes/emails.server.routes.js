'use strict';

const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');
const emails = require('../controllers/emails.server.controller');

module.exports = (app) => {


    /**
     * @apiDefine EmailParams
     *
     * @apiParam {String} name The name of the Email.
     * @apiParam {ObjectId} template  The Email Template.
     * @apiParam {Object[]} parts  A list of email parts.
     * @apiParam {String} part.name The unique name for the field in the template.
     * @apiParam {Mixed} part.value A value associated to the field.
     */

    /**
     * @apiDefine EmailResponse
     * @apiSuccess {ObjectId} _id The Email Object ID.
     * @apiSuccess {ObjectId} template  The Email Template.
     * @apiSuccess {Object[]} parts  A list of email parts.
     * @apiSuccess {String} part.name The unique name for the field in the template.
     * @apiSuccess {Mixed} part.value A value associated to the field.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     {
         "_id": {
             "$oid": "55d4aa36e5351303000a039b"
         },
         "template": {
             "$oid": "55ccb821090bff0300e78b62"
         },
         "createdOn": {
             "$date": "2015-08-19T16:09:26.812Z"
         },
         "parts": [
             {
                 "name": "subject",
                 "value": "subject",
                 "_id": {
                     "$oid": "55d4aa36e5351303000a039d"
                 }
             },
             {
                 "name": "comment",
                 "value": "comment",
                 "_id": {
                     "$oid": "55d4aa36e5351303000a039c"
                 }
             }
         ],
         "__v": 0
     }
     *
     */

    /**
     * @apiDefine EmailValidationError
     *
     * @apiError BadRequest Email validation failed.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "message": "Email validation failed"
     *     }
     */

    /**
     * @apiDefine EmailNotFoundError
     *
     * @apiError NotFound Email not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "message": "Email not found"
     *     }
     */

    app.route('/emails')
    /**
     * @api {get} /emails Get all the Emails.
     * @apiVersion 0.0.1
     * @apiName GetEmails
     * @apiGroup Email
     *
     * @apiUse AuthHeader
     *
     * @apiSuccess {Object[]} emails The list of Emails.
     * @apiSuccess {ObjectId} email._id The Email Object ID.
     * @apiSuccess {ObjectId} email.template  The Email Template.
     * @apiSuccess {Object[]} email.parts  A list of email parts.
     * @apiSuccess {String} email.part.name The unique name for the field in the template.
     * @apiSuccess {Mixed} email.part.value A value associated to the field.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     [{
     "_id": {
             "$oid": "55d4aa36e5351303000a039b"
         },
     "template": {
             "$oid": "55ccb821090bff0300e78b62"
         },
     "createdOn": {
             "$date": "2015-08-19T16:09:26.812Z"
         },
     "parts": [
     {
         "name": "subject",
         "value": "subject",
         "_id": {
             "$oid": "55d4aa36e5351303000a039d"
         }
     },
     {
         "name": "comment",
         "value": "comment",
         "_id": {
             "$oid": "55d4aa36e5351303000a039c"
         }
     }
     ],
     "__v": 0
     }]
     *
     *
     */
        .get(ensureAuthenticated, emails.list)

    /**
     * @api {post} /emails/ Create a Email.
     * @apiVersion 0.0.1
     * @apiName CreateEmail
     * @apiGroup Email
     *
     * @apiUse AuthHeader
     *
     * @apiUse EmailParams
     *
     * @apiUse EmailResponse
     *
     * @apiUse EmailValidationError
     */
        .post(ensureAuthenticated, emails.create);

    app.route('/emails/:emailId')
    /**
     * @api {get} /email/:emailId Get Email information.
     * @apiVersion 0.0.1
     * @apiName GetEmail
     * @apiGroup Email
     *
     * @apiUse AuthHeader
     *
     * @apiParam {ObjectId} emailId Email unique _id.
     *
     * @apiUse EmailResponse
     *
     * @apiUse EmailNotFoundError
     *
     */
        .get(ensureAuthenticated, emails.read)
    /**
     * @api {patch} /emails/:emailId Update Email information.
     * @apiVersion 0.0.1
     * @apiName PatchEmail
     * @apiGroup Email
     *
     * @apiUse AuthHeader
     *
     * @apiParam {ObjectId} emailId Email unique _id.
     * @apiUse EmailParams
     *
     * @apiUse EmailResponse
     *
     * @apiUse EmailNotFoundError
     * @apiUse EmailValidationError
     *
     */
        .patch(ensureAuthenticated, emails.patch)
    /**
     * @api {delete} /emails/:emailId Delete Email information.
     * @apiVersion 0.0.1
     * @apiName DeleteEmail
     * @apiGroup Email
     *
     * @apiUse AuthHeader
     *
     * @apiParam {ObjectId} emailId Email unique _id.
     * @apiUse EmailResponse
     *
     * @apiUse EmailNotFoundError
     *
     */
        .delete(ensureAuthenticated, emails.delete);

    app.param('emailId', emails.emailById);

};
