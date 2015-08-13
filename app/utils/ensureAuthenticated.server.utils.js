'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');

const config = require('../../config/config');


module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(token, config.tokenSecret);
    }
    catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.expire <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.email = payload.email;
    next();
};