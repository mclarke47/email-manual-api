'use strict';

const port = process.env.PORT || 1338;
const logLevel = process.env.LOG_LEVEL || 'warn';
const processId = process.env.DYNO || process.pid;
const db = process.env.MONGOLAB_URI || 'mongodb://localhost/ft-email-manual-api-test';
const googleSecret = process.env.GOOGLE_SECRET || 'testSecret';
const tokenSecret = process.env.TOKEN_SECRET || 'testSecret';
const authUser = process.env.BASIC_AUTH_USER || 'test';
const authPassword = process.env.BASIC_AUTH_PASSWORD || 'test';
const simpleEmailEndpoint = process.env.SIMPLE_EMAIL_ENDPOINT || 'https://localhost:1338';
const simpleEmailKey = process.env.SIMPLE_EMAIL_KEY || 'test';

module.exports = {
    port,
    db,
    processId,
    logLevel,
    googleSecret,
    tokenSecret,
    authUser,
    authPassword,
    simpleEmailEndpoint,
    simpleEmailKey
};