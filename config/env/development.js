'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const processId = process.env.DYNO || process.pid;
const db = process.env.MONGOLAB_URI || 'mongodb://localhost/ft-email-manual-api-dev';
const googleSecret = process.env.GOOGLE_SECRET;
const tokenSecret = process.env.TOKEN_SECRET || 'devSecret';
const authUser = process.env.BASIC_AUTH_USER || 'development';
const authPassword = process.env.BASIC_AUTH_PASSWORD || 'development';
const simpleEmailEndpoint = process.env.SIMPLE_EMAIL_ENDPOINT || 'https://localhost:1337';
const simpleEmailKey = process.env.SIMPLE_EMAIL_KEY || 'development';
const awsAccessKeyId = process.env.AWS_ACCESS_KEY || 'development';
const awsSecretAccessKey = process.env.AWS_SECRET_KEY || 'development';
const awsBucket = process.env.AWS_BUCKET || 'development';

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