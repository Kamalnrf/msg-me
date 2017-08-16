/**
 * Created by kamalnrf
 */
'use strict';

const redis = require('../services/redis');
const userModel = require('../app/model/userModel');

const msgMe = {
    /**
     * Creates and user and returns true if succesfuly created
     * @param fbID
     * @param userName
     * @returns {boolean}
     */
    createUser(fbID, userName) {
        try{
            redis.setKey(userName, fbID);

            const fbIDUser = {
                userName: userName,
                isTexting: false,
                texting: -1,
                lastMessage: -1,
                isOnline: true,
                userQueue: ['def'],
                usersBlocked: ['def'],
                onHold: -1,
                points: 0,
                friends: ['def']
            };

            redis.setHash(fbID, fbIDUser);

            redis.addToSet('users', fbID);

            const user = new userModel({
                userName: userName,
                fbID: fbID
            });

            user.save((error, user) => {
                if (error) return console.error(error);

                console.log("User has been successfully saved to mongodb");
            });

            return true;
        }catch (error){
            console.log(error);
        }
    },

    /**
     * Returns a promise which has the facbook id of the userName
     * @param userName
     * @return {Promise}
     */
    findUser(userName) {
        return redis.getKey(userName);
    },

    /**
     * Returns a promise which has userName existence boolean.
     * @param userID
     * @returns {Promise}
     */
    isExiting(userID) {
        return new Promise((resolve, reject) => {
            redis.getHash(userID)
                .then(hash => resolve((hash !== null)))
                .catch(error => reject(error));
        });
    },

    isExitingUser(userName) {
        return new Promise((resolve, reject) => {
            redis.getKey(userName)
                .then(fbID => resolve((fbID !== null)))
                .catch(error => reject(error));
        })
    },

    /**
     * Connects both sender and reciver
     * @param senderID
     * @param recieverID
     * @returns {boolean}
     */
    connect(senderID, recieverID) {
        try {
            redis.getHash(senderID)
                .then(senderHash => redis.getHash(recieverID)
                    .then(reciverHash => {
                        senderHash.isTexting = true;
                        reciverHash.isTexting = true;
                        senderHash.texting = recieverID;
                        reciverHash.texting = senderID;

                        redis.setHash(senderID, senderHash);
                        redis.setHash(recieverID, reciverHash);

                        this.addToConnected(senderID);
                        console.log("Completed changing th db value");
                    }));

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    /**
     * Removes the connection between sender and reciever.
     * @param senderID
     * @param recieverID
     * @returns {boolean}
     */
    disconnect(senderID, recieverID) {
        try {
            redis.getHash(senderID)
                .then(senderHash => redis.getHash(recieverID)
                    .then(reciverHash => {
                        senderHash.isTexting = false;
                        reciverHash.isTexting = false;
                        senderHash.texting = -1;
                        reciverHash.texting = -1;

                        redis.setHash(senderID, senderHash);
                        redis.setHash(recieverID, reciverHash);

                        this.removeConnected(senderID);
                        this.removeConnected(recieverID);
                    }));

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    addToConnected (senderID){
        redis.getKey('connectedList')
            .then(conList => {
                conList += ',' + senderID;

                redis.setKey('connectedList', conList);
            })
    },

    removeConnected (senderID) {
        redis.getKey('connectedList')
            .then(conList => {
                const list = conList.split(',')
                    .filter(element => element !== senderID);

                redis.setKey('connectedList', list);
            })
    },

    /**
     * Returns true if fbID is texting
     * @param fbID
     */
    isConnected(fbID) {
        return new Promise((resolve, reject) => {
            redis.getHash(fbID)
                .then(hash => {
                    resolve(hash.isTexting);
                })
                .catch(error => reject(error))
        });
    },

    /**
     * Returns recieverID
     * @param senderID
     */
    conectedTo(senderID) {
        return new Promise((resolve, reject) => {
            redis.getHash(senderID)
                .then(hash => {
                    resolve(hash.texting);
                })
                .catch(error => reject(error))
        });
    },

    /**
     * Returns whether the user is online or not.
     * @param fbId
     */
    isOnline(fbId){
        return new Promise((resolve, reject) => {
            redis.getHash(fbId)
                .then(hash => {
                    resolve(hash.isOnline);
                })
                .catch(error => reject(error))
        });
    },

    /**
     * Turns the user offline.
     * @param fbId
     * @returns {boolean}
     */
    async turnOffline(fbId){
        await redis.getHash(fbId)
            .then(hash => {
                hash.isOnline = false;

                redis.setHash(fbId, hash);
            });

        return true;
    },

    /**
     * Turns the user online.
     * @param fbID
     * @returns {boolean}
     */
    async turnOnline(fbID){
        await redis.getHash(fbID)
            .then(hash => {
                hash.isOnline = true;

                redis.setHash(fbID, hash);
            });

        return true;
    },

    /**
     * Returns the username of the facebook ID
     * @param fbID
     */
    getMyName (fbID){
        return new Promise((resolve, reject) => {
            redis.getHash(fbID)
                .then(hash => {
                    resolve(hash.userName);
                })
                .catch(error => reject(error));
        });
    },

    /**
     * Adds the reqUser to fbId queuue
     * @param fbID
     * @param reqUser
     */
    addQueue (fbID, reqUser) {
        redis.getHash(reqUser)
            .then(list => {
                list.userQueue += `,${fbID}`;
                redis.setHash(reqUser , list);
            });
    },

    /**
     * Adds the blockingUser to fbID
     * @param fbID
     * @param blockingUser
     */
    addBlocked (fbID, blockingUser) {
        redis.getHash(fbID)
            .then(hash => {
                hash.usersBlocked += `,${blockingUser}`;
                redis.setHash(fbID , hash);
            });
    },

    /**
     * Returns all the queued users of fbid
     * @param fbID
     * @returns {Promise}
     */
    getAllQueuedUsers (fbID) {
        return new Promise((resolve, reject) => {
            redis.getHash(fbID)
                .then(hash => {
                    resolve(hash.userQueue.split(','))
                });
        })
    },

    /**
     * Returns all the blocked users.
     * @param fbID
     * @returns {Promise}
     */
    getAllBlockedUsers (fbID) {
        return new Promise ((resolve, reject) => {
            redis.getHash(fbID)
                .then(hash => {
                    resolve(hash.usersBlocked.split(','))
                });
        })
    },

    /**
     * Removes all  the queued users of fbID.
     * @param fbID
     * @returns {Promise}
     */
    removeQueuedUsers (fbID) {
        return new Promise ((resolve, reject) => {
            redis.getHash(fbID)
                .then(hash => {
                    hash.userQueue = ['def'];

                    redis.setHash(fbID , hash);
                    resolve(true);
                });
        })
    },

    /***
     * unblocks the blockedID from snederID.
     * @param senderID
     * @param blockedID
     * @returns {Promise}
     */
    unBlock (senderID, blockedID){
        return new Promise((resolve, reject) => {
            redis.getHash(senderID)
                .then(hash => {
                    hash.usersBlocked = hash.usersBlocked.split(',').filter((element => element !== blockedID));

                    redis.setHash(senderID , list);
                })
        })
    },

    getFBID (userName) {
        return redis.getKey(userName);
    },

    isBlocked (senderID, reciverID){
        return new Promise((resolve, reject) => {
            redis.getHash(reciverID)
                .then(hash => {
                    const blockedUsers = hash.usersBlocked;

                    resolve( blockedUsers.split(',').filter(element => element === senderID).length !== 0);
                })
                .catch(errors => reject(errors));
        })
    },

     isIdle (senderID, reciecerID) {
        return new Promise ((resolve, reject) => {
            redis.getHash(senderID)
                .then(senderHash => {
                    console.log(`Sender hash: ${senderHash}`);
                    redis.getHash(reciecerID)
                        .then(reciecerHash => {
                            console.log(`Reciever hash: ${reciecerHash}`);
                            const senderLstMsg = senderHash.lastMessage;
                            const reciverLstMsg = senderHash.lastMessage;

                            if (senderLstMsg >= reciecerHash) {
                                console.log(senderLstMsg - reciverLstMsg);
                                resolve((senderLstMsg - reciverLstMsg) >= 5 || (senderLstMsg - reciverLstMsg) < 0);
                            }
                            else {
                                console.log(senderLstMsg - reciverLstMsg);
                                resolve((reciverLstMsg - senderLstMsg) >= 5 || (reciverLstMsg - senderLstMsg) < 0 );
                            }
                        })
                });
        })
    },

    getConnectedList (){
        return redis.getKey('connectedList');
    },

    async updateLastMSg (fbID) {
        const hash = await redis.getHash(fbID);

        const time = new Date();
        hash.lastMessage = time.getMinutes();

        await redis.setHash(fbID, hash);

        return true;
    }

};

module.exports = msgMe;