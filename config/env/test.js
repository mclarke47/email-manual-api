'use strict';

const port = process.env.PORT || 1338;
const logLevel = process.env.LOG_LEVEL || 'warn';
const processId = process.env.DYNO || process.pid;
const db = process.env.MONGOLAB_URI || 'mongodb://localhost/ft-email-manual-api-test';
const googleSecret = process.env.GOOGLE_SECRET || 'testSecret';
const tokenSecret = process.env.TOKEN_SECRET || 'testSecret';

module.exports = {
    port: port,
    db: db,
    processId: processId,
    logLevel: logLevel,
    googleSecret: googleSecret,
    tokenSecret: tokenSecret
};