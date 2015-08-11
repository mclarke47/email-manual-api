'use strict';

// External modules
require('dotenv').load({silent: true});

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const express = require('./config/express');
const mongoose = require('./config/mongoose');
const shutdown = require('./app/utils/shutdown.server.utils');
const logger = require('./config/logger');
const sentry = require('./config/sentry').init();

const loggerId = 'SERVER:' + config.processId;

/* istanbul ignore next */
process.on('SIGTERM', () => {
    shutdown(loggerId);
});

let db = mongoose();
let app = express();

app.listen(config.port);

module.exports = app;

logger.info(loggerId, process.env.NODE_ENV + ' server running', { location: 'http://localhost:' + config.port});