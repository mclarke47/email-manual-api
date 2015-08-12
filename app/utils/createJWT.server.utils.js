'use strict';
const jwt = require('jwt-simple');
const moment = require('moment');

const config = require('../../config/config');


module.exports = (email) => {
    let payload = {
        email: email,
        expire: moment().add(2, 'hours').unix()
    };
    return jwt.encode(payload, config.tokenSecret);
};