/**
 * Created by kamalnrf.
 */

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    fbID: String,
});

module.exports = mongoose.model("user", userSchema);