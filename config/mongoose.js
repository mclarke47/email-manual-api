'use strict';

const config = require('./config');
const mongoose = require('mongoose');

module.exports = function() {

    const db = mongoose.connect(config.db);

    //require('../app/models/emails.server.model');

    require('../app/models/template.server.model');

    return db;
};