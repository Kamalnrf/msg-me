/**
 * Created by kamalnrf.
 */

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockedUser = new Schema ({
    userName: String,
    fbID: String
});

const userSchema = new Schema({
    userName: { type: String, required: true},
    fbID: { type: String, required: true},
    blockedUsers: {type: [blockedUser]}
});

module.exports = mongoose.model("user", userSchema);