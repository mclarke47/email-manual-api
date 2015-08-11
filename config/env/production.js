'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const processId = process.env.DYNO;
const db = process.env.MONGOLAB_URI;


module.exports = {
    port: port,
    db: db,
    processId: processId,
    logLevel: logLevel
};