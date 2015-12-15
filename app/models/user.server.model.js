'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        required: 'email cannot be blank',
        index: { unique: true },
        type: String,
        trim: true,
        lowercase: true
    },
    permissions: {
        canCreateUsers: {
            type: Schema.Types.Mixed,
            default: false
        },
        canReadUsers: {
            type: Schema.Types.Mixed,
            default: false
        },
        canUpdateUsers: {
            type: Schema.Types.Mixed,
            default: false
        },
        canDeleteUsers: {
            type: Schema.Types.Mixed,
            default: false
        },
        canCreateEmails: {
            type: Schema.Types.Mixed,
            default: false
        },
        canReadEmails: {
            type: Schema.Types.Mixed,
            default: false
        },
        canUpdateEmails: {
            type: Schema.Types.Mixed,
            default: false
        },
        canDeleteEmails: {
            type: Schema.Types.Mixed,
            default: false
        },
        canCreateTemplates: {
            type: Schema.Types.Mixed,
            default: false
        },
        canReadTemplates: {
            type: Schema.Types.Mixed,
            default: false
        },
        canUpdateTemplates: {
            type: Schema.Types.Mixed,
            default: false
        },
        canDeleteTemplates: {
            type: Schema.Types.Mixed,
            default: false
        },
        canReadAnalytics: {
            type: Schema.Types.Mixed,
            default: true
        }
    }
});

mongoose.model('User', userSchema);