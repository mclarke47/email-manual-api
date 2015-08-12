'use strict';

const fetch = require('node-fetch');

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

    fetch(accessTokenUrl, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': new Buffer(params).length

        },
        body: params

    })
    .then(response => response.json())
    .then(json => {
            console.log(json);
            res.json(json);
        })
    .catch(error => {
            console.log(error);
            return res.status(500).send({
                message: error.message
            });
        });




};

