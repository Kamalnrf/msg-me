/**
 * Created by kamalnrf
 */

const nconf = require('nconf');

const facebook = {
    accessToken: 'EAABkKmXR6LIBAFRn3nXYBZAPeTZAZCR0EkZCt3ZA051tRk9v4mL0gIr4B0oTjsWRZABNg1kxAxokJP04ZAZC9IpeIoxpC4uG6qpqp9t20bJpCA4fM5mfstpJ9dZC5CuFX14O0Y4V5t16bio5clht9bVAfJZByPf4rMTyuA0lAJuAQ61oZAEtRbDJqZC6',
    verifyToken: 'bothook',
    appSecret: '5b37c0715b54f776515fb8adc91eca48'
};

const redisConfig = {
    redis: {
        port: 6379,
        host: 'localhost',
        pass: '',
        db: 1
    }
};

nconf.set('redis', redisConfig);
nconf.set('facebook', facebook);