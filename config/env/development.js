'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const processId = process.env.DYNO || process.pid;
const db = process.env.MONGOLAB_URI || 'mongodb://localhost/ft-email-manual-api-dev';
const googleSecret = process.env.GOOGLE_SECRET;
const tokenSecret = process.env.TOKEN_SECRET || 'devSecret';

module.exports = {
    port: port,
    db: db,
    processId: processId,
    logLevel: logLevel,
    googleSecret: googleSecret,
    tokenSecret: tokenSecret
};