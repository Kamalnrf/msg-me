/**
 * Created by kamalnrf.
 */

'use strict';
const redis = require('../../../services/redis');
const userModel = require('../app/model/userModel');

function User (userID){
    const userID = userID;
    const userHash = (this.isExiting(userID) ? redis.getHash(userID) : null);

    function createUser (userName){
        try{
            redis.setKey(userName, userID);

            const fbIDUser = {
                userName: userName,
                isTexting: false,
                texting: -1,
                lastMessage: -1,
                isOnline: true,
                userQueue: 'def',
                usersBlocked: 'def',
                onHold: -1,
                points: 0,
                friends: 'def'
            };

            redis.setHash(userID, fbIDUser);

            redis.addToSet('users', userID);

            const user = new userModel({
                userName: userName,
                fbID: userID
            });

            user.save((error, user) => {
                if (error) return console.error(error);

                console.log("User has been successfully saved to mongodb");
            });

            return true;
        }catch (error){
            console.log(error);
        }
    }

    /**
     * Returns a promise which has the facbook id of the userName
     * @param userName
     * @return {Promise}
     */
    function findUser(userName) {
        return redis.getKey(userName);
    }

    /**
     * This function checks the users existense
     * @param userID
     * @returns {boolean}
     */
    function isExiting(userID) {
        return userHash !== null;

    }

    function isExitingUser(userName) {
        return new Promise((resolve, reject) => {
            redis.getKey(userName)
                .then(fbID => resolve((fbID !== null)))
                .catch(error => reject(error));
        })
    }

    /**
     * Returns true if fbID is texting
     * @param fbID
     */
    function isConnected(fbID) {
        return userHash.isTexting;
    }

    /**
     * Returns recieverID
     * @param senderID
     */
    function conectedTo(senderID) {
        return userHash.texting;
    }

    /**
     * Returns whether the user is online or not.
     * @param fbId
     */
    function isOnline(fbId){
        return userHash.isOnline;
    }

    /**
     * Turns the user offline.
     * @param fbId
     * @returns {boolean}
     */
    async function turnOffline(){
        try {
            userHash.isOnline = false;

            await redis.setHash(userID, userHash);

            return true;
        }catch (error){
            return false;
        }
    }

    /**
     * Turns the user online.
     * @param fbID
     * @returns {boolean}
     */
    async function turnOnline(){
        try {
            userHash.isOnline = true;

            await redis.setHash(userID, userHash);

            return true;
        }catch (error) {
            return false;
        }
    }
}