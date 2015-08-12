'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const processId = process.env.DYNO;
const db = process.env.MONGOLAB_URI;
const googleSecret = process.env.GOOGLE_SECRET;
const tokenSecret = process.env.TOKEN_SECRET;


module.exports = {
    port: port,
    db: db,
    processId: processId,
    logLevel: logLevel,
    googleSecret: googleSecret,
    tokenSecret: tokenSecret
};