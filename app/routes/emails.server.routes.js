'use strict';

const ensureAuthenticated = require('../utils/ensureAuthenticated.server.utils');
const emails = require('../controllers/emails.server.controller');

module.exports = (app) => {


    /**
     * @apiDefine EmailParams
     *
     * @apiParam {String} subject The subject of the Email.
     * @apiParam {ObjectId} template  The Email Template.
     * @apiParam {Object[]} parts  A list of email parts.
     * @apiParam {String} part.name The unique name for the field in the template.
     * @apiParam {Mixed} part.value A value associated to the field.
     * @apiParam {Object} [body] The compiled body of the email.
     * @apiParam {String} [body.plain] The compiled plain text body of the email.
     * @apiParam {String} [body.html] The compiled HTML body of the email.
     * @apiParam {Boolean} [dirty=false] An email is dirty once it has been edited once
     * @apiParam {Boolean} [valid=false] An email is valid if its parts pass validation
     * @apiParam {Boolean} [sent=false] An email is sent if it has been sent
     * @apiParam {Boolean} [toSubEdit=false] An email is toSubEdit if it is ready to be subEdited
     * @apiParam {Boolean} [subEdited=false] An email is subEdited if it has already been subEdited
     * @apiParam {Date} [sendTime] The time at which an email has to be sent

     */

    /**
     * @apiDefine EmailResponse
     * @apiSuccess {ObjectId} _id The Email Object ID.
     * @apiSuccess {String} subject The subject of the Email.
     * @apiSuccess {ObjectId} template  The Email Template.
     * @apiSuccess {Object[]} parts  A list of email parts.
     * @apiSuccess {String} part.name The unique name for the field in the template.
     * @apiSuccess {Mixed} part.value A value associated to the field.
     * @apiSuccess {Object} [body] The compiled body of the email.
     * @apiSuccess {String} [body.plain] The compiled plain text body of the email.
     * @apiSuccess {String} [body.html] The compiled HTML body of the email.
     * @apiSuccess {Boolean} [dirty=false] An email is dirty once it has been edited once
     * @apiSuccess {Boolean} [valid=false] An email is valid if its parts pass validation
     * @apiSuccess {Boolean} [sent=false] An email is sent if it has been sent
     * @apiSuccess {Boolean} [toSubEdit=false] An email is toSubEdit if it is ready to be subEdited
     * @apiSuccess {Boolean} [subEdited=false] An email is subEdited if it has already been subEdited
     * @apiSuccess {Date} [sendTime] The time at which an email has to be sent
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     {
         "subject": "The email subject",
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
     * @apiParam {Number} [p=1]  The pagination page to retrieve.
     * @apiParam {Number} [pp=100] The number of Users per page to retrieve.
     * @apiParam {ObjectId} [t] Filter emails by a specific template _id.
     * @apiParam {Boolean} [dirty] Filter emails by the dirty status.

     *
     * @apiSuccess {Object[]} emails The list of Emails.
     * @apiSuccess {ObjectId} email._id The Email Object ID.
     * @apiSuccess {ObjectId} email.subject The Email Subject.
     * @apiSuccess {ObjectId} email.template  The Email Template.
     * @apiSuccess {Object[]} email.parts  A list of email parts.
     * @apiSuccess {String} email.part.name The unique name for the field in the template.
     * @apiSuccess {Mixed} email.part.value A value associated to the field.
     * @apiSuccess {Boolean} [email.dirty=false] An email is dirty once it has been edited once
     * @apiSuccess {Boolean} [email.valid=false] An email is valid if its parts pass validation
     * @apiSuccess {Boolean} [email.sent=false] An email is sent if it has been sent
     * @apiSuccess {Boolean} [email.toSubEdit=false] An email is toSubEdit if it is ready to be subEdited
     * @apiSuccess {Boolean} [email.subEdited=false] An email is subEdited if it has already been subEdited
     * @apiSuccess {Date} [email.sendTime] The time at which an email has to be sent
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     [{
         "_id": {
                 "$oid": "55d4aa36e5351303000a039b"
             },
         "subject": "The email subject",
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
         }],
     }]
     *
     *
     */
        .get(ensureAuthenticated, emails.list)

    /**
     * @api {post} /emails/ Create a Email.
     * @apiVersion 0.2.0
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
     * @apiVersion 0.2.0
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
     * @apiVersion 0.2.0
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
     * @apiVersion 0.2.0
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
