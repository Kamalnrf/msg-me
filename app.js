/**
 * Created by kamalnrf
 */

'use strict';

const BootBot = require('bootbot');
const nconf = require('nconf');
const server = require('./config/initializers/server');
const redis = require('./services/redis');
const setUp = require('./config/initializers/setup');
const message = require('./app/messenger/message');

nconf.use('memory');
// Load Environment variables from .env file
require('dotenv').load();
// Load environment variables
nconf.env();

//Load all development variables
require('./config/enviorment/'+nconf.get('NODE_ENV'));

console.log(nconf.get('NODE_ENV'));

global.bot = new BootBot({
    accessToken: nconf.get('facebook:accessToken'),
    verifyToken: nconf.get('facebook:verifyToken'),
    appSecret: nconf.get('facebook:appSecret')
});

//Initializing redis.
redis.init(nconf.get('redis'));

//Basic setup such as getting started messages, persistent menu initialization and redis
setUp(bot);

//Messages
message(bot);

//Starting the server
server(bot);

