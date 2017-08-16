/**
 * Created by kamalnrf
 */

const nconf = require('nconf');

// Load Environment variables from .env file
require('dotenv').load();
// Load environment variables
nconf.env();

const facebook = {
    accessToken: nconf.get('NODE_ACCESSTOKEN'),
    verifyToken: nconf.get('NODE_VERIFYTOKEN'),
    appSecret: nconf.get('NODE_APPSECRET')
};

const redisConfig = {
    redis: {
        port: 6379,
        host: 'localhost',
        pass: '',
        db: 5
    }
};

nconf.set('redis', redisConfig);
nconf.set('facebook', facebook);