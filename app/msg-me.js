/**
 * Created by kamalnrf
 */
'use strict';

const redis = require('../services/redis');

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
     * @param fbId
     */
    conectedTo(senderID) {
        return redis.getKey(fbId + "Texting");
    }
};

module.exports = msgMe;