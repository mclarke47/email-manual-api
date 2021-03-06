'use strict';
const jwt = require('jwt-simple');
const moment = require('moment');

const config = require('../../config/config');


module.exports = (email) => {
    let payload = {
        email: email,
        expire: moment().add(7, 'days').unix()
    };
    return jwt.encode(payload, config.tokenSecret);
};