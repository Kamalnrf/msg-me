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

    redis.init(redisConfig);

    it ("online/offline test", done => {
        msg_me.isOnline(1663257250351557)
            .then(state => {
                expect(state).toBe('true');
                done();
            });
    });

    it ("turn offline test", done => {
        msg_me.turnOffline(1663257250351557)
            .then(result => {
                msg_me.isOnline(1663257250351557)
                    .then(state => {
                        expect(state).toBe('false');
                        done();
                    });
            });

    });

    it ("turns online test", done => {
        msg_me.turnOnline(1663257250351557)
            .then(result => {
                msg_me.isOnline(1663257250351557)
                    .then(state => {
                        expect(state).toBe('true');
                        done();
                    });
            })
    })
   /* // it("Creating user test", done => {
    //     msg_me.createUser("1301322373237717", "kamalnrf");
    //
    //     redis.getKey("1301322373237717")
    //         .then(userName => {
    //
    //             expect(userName).toBe("kamalnrf");
    //
    //             done();
    //         })
    //         .catch(error => {
    //             fail(error);
    //         });
    // });
    //
    // it("Find user", done => {
    //     msg_me.createUser("17639", "findMe");
    //
    //     redis.getKey("findMe")
    //         .then(fbID => {
    //
    //             expect(msg_me.findUser("findMe")).toBe(fbID);
    //
    //             done();
    //         })
    //         .catch(error => {
    //             fail(error);
    //         })
    // });
    //
    // it ("Connect", done => {
    //     msg_me.connect("17639", "1301322373237717");
    //
    //     redis.getKey("17639isTexting")
    //         .then(isTexting => {
    //             expect(isTexting).toBe(true);
    //         })
    // });
    //
    // it ("Disconnect", done => {
    //     msg_me.connect("17639", "1301322373237717");
    //     msg_me.disconnect("17639");
    //
    //     redis.getKey("17639isTexting")
    //         .then(isTexting => {
    //             expect(isTexting).toBe(false);
    //         })
    // });*/
});