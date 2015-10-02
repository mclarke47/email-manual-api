'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');

let accessKeyId =  process.env.AWS_ACCESS_KEY; //TODO: use config
let secretAccessKey = process.env.AWS_SECRET_KEY; //TODO: use config

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

let photoBucket = new AWS.S3({params: { Bucket: process.env.AWS_BUCKET }});


var s3 = new AWS.S3();

/* istanbul ignore next */ //TODO
function uploadToS3(file, destFileName, callback) {

    photoBucket
        .upload({
            ACL: 'public-read',
            Body: fs.createReadStream(file.path),
            Key: destFileName.toString(),
            ContentType: 'application/octet-stream' // force download if it's accessed as a top location
        })
        // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
        // .on('httpUploadProgress', function(evt) { console.log(evt); })
        // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
        .send(callback);
}

/* istanbul ignore next */ //TODO
module.exports = (req, res) => {

    if (!req.file) {
        return res.status(403).send('expect 1 file upload named image').end();
    }

    let file = req.file;

    if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
        return res.status(403).send('expect image file').end();
    }

    let pid = '10000' + parseInt(Math.random() * 10000000); // TODO: use GUID

    uploadToS3(file, pid, function (err, data) {
        if (err) {
            console.error(err);
            return res.status(500).send('failed to upload to s3').end();
        }
        return res.status(201).json( { url: data.Location }).end();
    });

};
