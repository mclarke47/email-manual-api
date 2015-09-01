'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const emailSchema = new Schema({
    subject: {
        required: 'subject cannot be blank',
        type: String,
        trim: true
    },
    template: {
        required: 'template cannot be blank',
        type: Schema.Types.ObjectId,
        ref: "Template"
    },
    parts: [{
        name: {
            type: String,
            trim: true,
            required: 'name cannot be blank'
        },
        value: Schema.Types.Mixed
    }],
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now,
        index: true
    },
    body: {
        plain: {
            type: String,
            trim: true
        },
        html: {
            type: String,
            trim: true
        }
    }
});

mongoose.model('Email', emailSchema);