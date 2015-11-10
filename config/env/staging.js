'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const processId = process.env.DYNO;
const db = process.env.MONGOHQ_URL;
const googleSecret = process.env.GOOGLE_SECRET;
const tokenSecret = process.env.TOKEN_SECRET;
const authUser = process.env.BASIC_AUTH_USER;
const authPassword = process.env.BASIC_AUTH_PASSWORD;
const simpleEmailEndpoint = process.env.SIMPLE_EMAIL_ENDPOINT;
const simpleEmailKey = process.env.SIMPLE_EMAIL_KEY;
const awsAccessKeyId =  process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_KEY;
const awsBucket = process.env.AWS_BUCKET;

module.exports = {
    awsAccessKeyId,
    awsBucket,
    awsSecretAccessKey,
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