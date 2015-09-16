'use strict';

const config = require('../../config/config');

const jwt = require('jwt-simple');
const moment = require('moment');
const bAuth = require('basic-auth');
const createJWT = require('../utils/createJWT.server.utils');

module.exports = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }

    let method = req.headers.authorization.split(' ')[0];

    if (method === 'Bearer') {
        jwtAuth(req, res, next);
    }
    else if (method === 'Basic') {
        basicAuth(req, res, next);
    }
    else {
        return res.status(401).send({ message: 'Authentication method not supported' });
    }

};


function jwtAuth (req, res, next) {

    let reqToken = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(reqToken, config.tokenSecret);
    }
    catch (err) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    if (payload.expire <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }

    let resToken = createJWT(payload.email);
    res.header('X-Auth', resToken);
    res.cacheControl({ noStore: true });

    next();

}


function basicAuth (req, res, next) {

    let credentials = bAuth(req);

    if (!credentials || credentials.name !== config.authUser || credentials.pass !== config.authPassword) {
        return res.status(401).send({ message: 'Invalid username or password' });
    }

    next();

}