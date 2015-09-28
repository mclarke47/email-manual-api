'use strict';

// External modules

const fetch = require('node-fetch');

// Our modules
const config = require('../../config/config');
const logger = require('../../config/logger');

exports.sendByAddress = (emailId, from, to, subject, body) => {

    let payload = {
        transmissionHeader: {
            returnPath: from.address,
            metadata: {
                emailId: emailId,
                test: true
            }
        },
        from: from,
        to: {
            address: to
        },
        subject: subject,
            htmlContent: body.html,
            plainTextContent: body.plain
        };

    let stringBody = JSON.stringify(payload);

    return new Promise((fulfill, reject) => {

        let endpoint = config.simpleEmailEndpoint + '/send-by-address';
        let auth = config.simpleEmailKey;

        fetch(endpoint, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Content-Length': Buffer.byteLength(stringBody)
            },
            body: stringBody
        })
        .then(response => {
            /* istanbul ignore else */
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(fulfill)
        .catch(reject);

    });
};