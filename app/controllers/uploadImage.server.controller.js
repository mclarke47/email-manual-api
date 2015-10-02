'use strict';

module.exports = (req, res) => {

    return res.status(201).json({
        url: 'http://4.bp.blogspot.com/-XkviAtJ1s6Q/T3YFb2RUhDI/AAAAAAAAAVQ/EHomLZlFMKo/s1600/small+cat.jpg',
        funcNum: req.query.CKEditorFuncNum,
        someOtherProperty: 'someText'
    });

};
