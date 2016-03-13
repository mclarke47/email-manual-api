'use strict';

const request = require('request');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const config = require('../../config/config');
const createJWT = require('../utils/createJWT.server.utils');

const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

const domain = 'ft.com';


exports.accessTokenUrl = accessTokenUrl;
exports.peopleApiUrl = peopleApiUrl;

exports.authenticate = (req, res) => {

    let params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.googleSecret,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };


    request.post(accessTokenUrl, { json: true, form: params }, (err, response, token) => {

        /* istanbul ignore if */
        if (err) {
            return res.status(500).send({
                message: err.message
            });
        }

        if (token.error) {
            return res.status(response.statusCode).send({message: token.error});
        }

        const accessToken = token.access_token;

        let headers = { Authorization: 'Bearer ' + accessToken };


        request.get({ url: peopleApiUrl, headers: headers, json: true }, (err, response, profile) => {

            /* istanbul ignore next */
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }

            if (profile.error) {
                return res.status(response.statusCode).send({message: profile.error.message});
            }

            let userEmail = profile.email;

            User.findOne({ email: userEmail}).exec((err, user) => {
                if (user) {

                    let token = createJWT(userEmail);
                    return res.send({ token: token, profile: profile, user: user });

                } else {
                    console.log('Unauthorised: ', userEmail);
                    return res.status(401).send({
                        message: 'Unauthorized'
                    });
                }
            });

        });

    });

};

