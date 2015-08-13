'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const fieldSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'name cannot be blank'
    },
    type: {
        type: String,
        trim: true,
        enum: ['textbox', 'wysiwyg'],
        required: 'type cannot be blank'
    },
    options: [Schema.Types.Mixed]
});

mongoose.model('Field', fieldSchema);