/**
 * Created by kamalnrf.
 */

'use strict';

const mongoose = require('mongoose');

const mongoDb = (url) => {

    mongoose.connect(url, (error, db) => {
        if (!error)
            console.log("Connectedd to mongodb");
    });
};

module.exports = mongoDb;