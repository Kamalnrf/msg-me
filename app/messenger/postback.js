/**
 * Created by kamalnrf
 */

'use strict';

const msg_me = require('../msg-me');
const connection = require('./handlers/connection');
const newUser = require('./handlers/createUserOperator');
const feedback = require('./handlers/feedback');
const shrImage = require('./handlers/shrImage');
const helper = require('../helpers/helper');


const postback = (bot) => {

    bot.on('postback', (payload, chat) => {
       console.log(payload);

       helper.chooseThePostback(payload, chat);

    });

    bot.on('postback:REQ_YES', (payload, chat) => {
        console.log(payload);
        const senderID = payload.sender.id;

        msg_me.whatIsOnHold(senderID)
            .then(recieverID => {
                if (recieverID !== '-1') {
                    if (msg_me.connect(senderID, recieverID) === true) {
                        chat.say(`A connection has been established`);
                        bot.say(recieverID, `A connection has been established`);
                    }
                }else {
                    chat.say(`Your request has been, expired.`);
                }
            });
    });

    bot.on('postback:REQ_NO', (payload, chat) => {
        console.log(payload);
        const senderID = payload.sender.id;

        msg_me.whatIsOnHold(senderID)
            .then(recieverID => {
                if (recieverID !== '-1') {
                    if (msg_me.disconnect(senderID, recieverID) === true) {
                        chat.say(`Ok`);
                        bot.say(recieverID, `Your request has been rejected, try connecting with someone else.`);
                        msg_me.removeQueuedUsers(recieverID);
                    }
                }else {
                    chat.say(`OK.`);
                }
            });
    });
    /*//----------Online/Offline--------//
    bot.on('postback:online/offline', (payload, chat) => {
        console.log(payload);

    });*/

    /*//----------Start a conversation----//
    bot.on('postback:_start', (payload, chat) => {
        console.log(payload);

    });*/

    /*//----------My User Name-----------//
    bot.on('postback:myName', (payload, chat) => {
        console.log(payload);


    });*/

    console.log(`Initialized the postbacks.`);
};



module.exports = postback;