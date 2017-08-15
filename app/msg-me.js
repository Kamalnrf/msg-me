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
            redis.setKey(fbID, userName);
            redis.setKey(userName, fbID);
            redis.setKey(fbID + "isTexting", false);
            redis.setKey(fbID + "Texting", -1);
            redis.setKey(fbID + "isOnline", true);

            const list = {
                userQueue: ['def'],
                usersBlocked: ['def']
            };

            redis.setHash(fbID + "list", list);

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
     * @param userName
     * @returns {Promise}
     */
    isExiting(userName) {
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
            redis.setKey(senderID + "isTexting", true);
            redis.setKey(recieverID + "isTexting", true);
            redis.setKey(senderID + "Texting", recieverID);
            redis.setKey(recieverID + "Texting", senderID);

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
            redis.setKey(senderID + "isTexting", false);
            redis.setKey(recieverID + "isTexting", false);
            redis.setKey(senderID + "Texting", -1);
            redis.setKey(recieverID + "Texting", -1);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    /**
     * Returns true if fbID is texting
     * @param fbID
     */
    isConnected(fbID) {
        return redis.getKey(fbID + "isTexting");
    },

    /**
     * Returns recieverID
     * @param senderID
     */
    conectedTo(senderID) {
        return redis.getKey(senderID + "Texting");
    },

    /**
     * Returns whether the user is online or not.
     * @param fbId
     */
    isOnline(fbId){
        return redis.getKey(fbId + "isOnline");
    },

    /**
     * Turns the user offline.
     * @param fbId
     * @returns {boolean}
     */
    turnOffline(fbId){
        redis.setKey(fbId + "isOnline", false);

        return true;
    },

    /**
     * Turns the user online.
     * @param fbID
     * @returns {boolean}
     */
    turnOnline(fbID){
        redis.setKey(fbID + "isOnline", true);

        return true;
    },

    /**
     * Returns the username of the facebook ID
     * @param fbID
     */
    getMyName (fbID){
        return redis.getKey(fbID);
    },

    addQueue (fbID, reqUser) {
        redis.getHash(fbID+"list")
            .then(list => {
                list.userQueue += `,${reqUser}`;
                redis.setHash(fbID + "list", list);
            });
    },

    addBlocked (fbID, blockingUser) {
        redis.getHash(fbID+"list")
            .then(list => {
                list.usersBlocked += `,${blockingUser}`;
                redis.setHash(fbID + "list", list);
            });
    },

    getAllQueuedUsers (fbID) {
        return new Promise((resolve, reject) => {
            redis.getHash(fbID+"list")
                .then(list => {
                    console.log(list.userQueue);
                    console.log(list.userQueue.split[',']);
                    resolve(list.userQueue.split[','])
                });
        })
    },

    getAllBlockedUsers (fbID) {
        return new Promise ((resolve, reject) => {
            redis.getHash(fbID+"list")
                .then(list => {
                    resolve(list.usersBlocked.split[','])
                });
        })
    },

    removeQueuedUsers (fbID) {
        return new Promise ((resolve, reject) => {
            redis.getHash(fbID+"list")
                .then(list => {
                    const newList = {
                        userQueue: ['def'],
                        usersBlocked: list.usersBlocked
                    };

                    redis.setHash(fbID + "list", newList)
                    resolve(true);
                });
        })
    },

    unBlock (senderID, blockedID){
        return new Promise((resolve, reject) => {
            redis.getHash(senderID + "list")
                .then(list => {
                    list.usersBlocked = list.usersBlocked.map((element => element !== ',' + blockedID));

                    redis.setHash(senderID + 'list', list);
                })
        })
    }
};

module.exports = msgMe;