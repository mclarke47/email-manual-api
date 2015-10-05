'use strict';

const fs = require('fs');
const s3 = require('../../config/s3');
const uuid = require('node-uuid');


/* istanbul ignore next */ //TODO
function uploadToS3(file, destFileName, callback) {

    s3.upload({
        ACL: 'public-read',
        Body: fs.createReadStream(file.path),
        Key: destFileName.toString(),
        ContentType: 'application/octet-stream' // force download if it's accessed as a top location
    })
    .send(callback);
}

/* istanbul ignore next */ //TODO
module.exports = (req, res) => {

    if (!req.file) {
        return res.status(403).json({ message: 'expect 1 file upload named image' });
    }

    let file = req.file;

    if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
        return res.status(403).json({ message: 'expect image file' } );
    }

    let uuid = uuid.v4();

    uploadToS3(file, uuid, function (err, data) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'failed to upload to s3' });
        }
        return res.status(201).json({ url: data.Location });
    });

};
