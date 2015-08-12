'use strict';

const request = require('request');

const config = require('../../config/config');

exports.authenticate = (req, res) => {
    const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    let params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.googleSecret,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };


    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
        if (err) {
            return res.status(500).send({
                message: error.message
            });
        }

        const accessToken = token.access_token;

        let headers = { Authorization: 'Bearer ' + accessToken };


        request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

            if (profile.error) {
                return res.status(500).send({message: profile.error.message});
            }


            console.log(profile);
            res.send({ token: '123' });


        });

    });

};

