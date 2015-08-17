'use strict';

const mongoose = require('mongoose');

const createJWT = require('../utils/createJWT.server.utils');


exports.list = (req, res) => {
    let token = createJWT(req.email);
    res.header('X-Auth', token);
    res.json([]);
};