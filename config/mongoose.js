'use strict';

const config = require('./config');
const mongoose = require('mongoose');

module.exports = function() {

    const db = mongoose.connect(config.db);

    require('../app/models/template.server.model');
    require('../app/models/email.server.model');

    return db;
};