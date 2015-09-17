'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const processId = process.env.DYNO;
const db = process.env.MONGOLAB_URI;
const googleSecret = process.env.GOOGLE_SECRET;
const tokenSecret = process.env.TOKEN_SECRET;
const authUser = process.env.BASIC_AUTH_USER;
const authPassword = process.env.BASIC_AUTH_PASSWORD;
const simpleEmailEndpoint = process.env.SIMPLE_EMAIL_ENDPOINT;
const simpleEmailKey = process.env.SIMPLE_EMAIL_KEY;

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