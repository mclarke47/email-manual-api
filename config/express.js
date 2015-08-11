'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const basicAuth = require('basic-auth-connect');


const config = require('./config');

module.exports = () => {

    let app = express();

    app.use(compression());

    app.use(bodyParser.urlencoded({
        extended: true,
        limit:'1mb'
    }));

    app.use(bodyParser.json({
        limit:'1mb'
    }));

    // NOTE: we expose the public folder before adding basic authentication!
    app.use(express.static('./public'));

    // NOTE: we expose the health and gtg endpoints folder before adding basic authentication!
    //require('../app/routes/__health.server.routes')(app);
    //require('../app/routes/__gtg.server.routes')(app);

    //// Authenticator
    //app.use(basicAuth(config.authUser, config.authPassword));

    //require('../app/routes/emails.server.routes.js')(app);
    //require('../app/routes/templates.server.routes.js')(app);


    return app;
};