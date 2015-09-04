'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const cacheResponseDirective = require('express-cache-response-directive');


const config = require('./config');

module.exports = () => {

    let app = express();

    app.use(compression());

    app.use(cors({
        origin: true,
        credentials: true,
        exposedHeaders: ['X-Auth', 'X-Page', 'X-Total-Count', 'X-Per-Page']
    }));

    app.use(bodyParser.urlencoded({
        extended: true,
        limit:'1mb'
    }));

    app.use(bodyParser.json({
        limit:'1mb'
    }));

    app.use(cacheResponseDirective());

    app.use(express.static('./public'));

    //require('../app/routes/__health.server.routes')(app);
    //require('../app/routes/__gtg.server.routes')(app);

    require('../app/routes/auth.server.routes')(app);

    require('../app/routes/emails.server.routes.js')(app);
    require('../app/routes/templates.server.routes.js')(app);



    return app;
};
