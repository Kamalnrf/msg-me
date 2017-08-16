/**
 * Created by kamalnrf
 */

'use strict';

const msg_me = require('../app/msg-me');
const redis = require('../services/redis');

describe("msg-me test", function() {
    const redisConfig = {
        redis: {
            port: 6379,
            host: 'localhost',
            pass: '',
            db: 5
        }
    };

    const userID = 123;
    const userName = 'kamalnrfTester';
    const userID2 = 145;
    const userName2 = 'mukkamala';

    redis.init(redisConfig);

    it ('Creating user test', done => {
        msg_me.createUser(userID, userName);
        msg_me.createUser(userID2, userName2);

        msg_me.findUser(userName)
            .then(userID => {
                this.userID = userID;
                done();
            })
    });

    it ('Testing is existing', done => {
        msg_me.isExiting(userID)
            .then(existence => {
                expect(existence).toBe(true);

                done();
            });
    });

    it ('Connection', done => {
        msg_me.connect(userID, userID2);

        done();
    });

    it ('connection validity', done => {
        msg_me.conectedTo(userID)
            .then(texting => {
                expect(texting).toBe(userID2);

                done();
            })
    });

    it ('disconnect', done => {
        msg_me.disconnect(userID, userID2);

        msg_me.isConnected(userID)
            .then(isConnected => {
                expect(isConnected).toBe('false');
                done();
            })
    });

    it ("online/offline test", done => {
        msg_me.isOnline(userID)
            .then(state => {
                expect(state).toBe('true');
                done();
            });
    });

    it ("turn offline test", done => {
        msg_me.turnOffline(userID)
            .then(result => {
                msg_me.isOnline(userID)
                    .then(state => {
                        expect(state).toBe('false');
                        done();
                    });
            });

    });

    it ("turns online test", done => {
        msg_me.turnOnline(userID)
            .then(result => {
                msg_me.isOnline(userID)
                    .then(state => {
                        expect(state).toBe('true');
                        done();
                    });
            })
    })
});