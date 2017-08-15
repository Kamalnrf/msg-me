/**
 * Created by Kamal
 */
'use strict';
const Q = require('q');
const redis = require('redis');

let isRedis = false;

// Redis client object
let client;

let methods = ['eval', 'del', 'hdel', 'expire', 'get', 'set', 'del', 'keys'];

function createClientQ(client) {
    methods.forEach(function (method) {
        client[method + 'Q'] = Q.nbind(client[method], client);
    });

    return client;
}

function createClient(config, returnBuffers) {
    var client;

    client = redis.createClient(config.port, config.host, {return_buffers: returnBuffers});
    client = createClientQ(client);

    if (config.pass) {
        client.auth(config.pass);
    }

    if (config.db) {
        client.select(config.db);
    }

    client.on('error', function (err) {
        console.error(err);
    });

    client.on('connect', function () {
        isRedis = true;
        console.log("Conectedt to Redis...");
    });

    return client;
}

exports.redisIsReady = function () {
    return isRedis;
};

// Initializing DB
exports.init = function initRedis(config) {
    client = createClient(config.redis);
};

exports.setHash = function (hashName, jsonObject) {
    return client.hmset(hashName, jsonObject)
};


// Deletes hash from Redis
exports.deleteHash = function (hashName) {
    return client.delQ(hashName);
};

/*
 * Deletes key from hash
 * hashName  hash where key is located
 * key       key name of entry that will be deleted
 */
exports.deleteHashKey = function (hashName, key) {
    return client.hdelQ(hashName, key);
};

/*
 * Setting expire for key after which it will be deleted
 * keyName     name of the key
 * expireTime expire time in seconds
 */
exports.setExpire = function (keyName, expireTime) {
    return client.expireQ(keyName, expireTime);
};

exports.setKey = function (keyName, value) {
    return client.setQ(keyName, value);
};

exports.getKey = function (keyName) {
    return client.getQ(keyName);
};

exports.findFirstKey = function (pattern) {
    return client.keysQ(pattern)
        .then(function (keys) {
            return keys && keys.length && keys[0];
        });
};

//Returns redis client
exports.getClient = function () {
    return client;
};