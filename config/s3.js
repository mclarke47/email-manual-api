'use strict';


const AWS = require('aws-sdk');
const config = require('./config');

const accessKeyId =  config.awsAccessKeyId;
let secretAccessKey = config.awsSecretAccessKey;

AWS.config.update({
    accessKeyId,
    secretAccessKey
});


module.exports = new AWS.S3({
    params: {
        Bucket: config.awsBucket
    }
});

