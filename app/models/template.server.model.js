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
    labelColor: {
        type: String,
        trim: true
    },
    fields: [{
        label: {
            type: String,
            trim: true,
            required: 'label cannot be blank'
        },
        name: {
            type: String,
            trim: true,
            required: 'name cannot be blank'
        },
        options: Schema.Types.Mixed,
        type: {
            type: String,
            trim: true,
            enum: ['textbox', 'wysiwyg', 'footerWidget', 'authorWidget'],
            required: 'type cannot be blank'
        }
    }]
});

mongoose.model('Template', templateSchema);