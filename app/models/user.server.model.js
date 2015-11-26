'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        required: 'email cannot be blank',
        index: true,
        type: String,
        trim: true
    },
    permissions: {
        canDisplayUsers: Schema.Types.Mixed
    }
});

mongoose.model('User', userSchema);