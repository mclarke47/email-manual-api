'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const templateSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'name cannot be blank'
    },
    path: {
        type: String,
        trim: true,
        required: 'path cannot be blank'
    },
    fields: [{
        type: Schema.Types.ObjectId,
        ref: 'Field'
    }]
});

mongoose.model('Template', templateSchema);