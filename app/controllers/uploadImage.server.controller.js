'use strict';

module.exports = (req, res) => {

    return res.status(201).json({
        url: 'http://www.example.com/image.jpg',
        funcNum: req.query.CKEditorFuncNum
    });

};