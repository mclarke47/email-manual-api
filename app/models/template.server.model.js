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
    campaignParam: {
        type: String,
        trim: true
    },
    from: {
        address: {
            type: String,
            trim: true,
            default: 'FT@newsletters.ft.com'
        },
        name: {
            type: String,
            trim: true,
            default: 'Financial Times'
        }
    },
    list: {
        type: String,
        trim: true,
        required: 'list cannot be blank'
    },
    fields: [{
        label: {
            type: String,
            trim: true
        },
        name: {
            type: String,
            trim: true,
            required: 'field_name cannot be blank'
        },
        options: Schema.Types.Mixed,
        type: {
            type: String,
            trim: true,
            required: 'field_type cannot be blank'
        }
    }]
});

mongoose.model('Template', templateSchema);
