/**
 * Created by kamalnrf
 */

'use strict';

const msg_me = require('../msg-me');
const connection = require('./handlers/connection');
const newUser = require('./handlers/createUserOperator');

const postback = (bot) => {
    //----------Online/Offline--------//
    bot.on('postback:online/offline', (payload, chat) => {
        const fbID = payload.sender.id;

        msg_me.isOnline(fbID)
            .then(isOnline => {
                if (isOnline)
                    (msg_me.turnOffline(fbID)) ? chat.say("Turned you offline") : chat.say("Something went wrong tryagain");
                else if (isOnline === false || isOnline === "false")
                    (msg_me.turnOnline(fbID)) ? chat.say("Turned you online") : chat.say("Something went wrong tryagain");
                else
                    chat.say("You need to create a user name first.")
                        .then(() => {
                            chat.conversation((convo) => {
                                convo.sendTypingIndicator(1000).then(() => newUser.createUser(convo, payload));
                            })
                        });
            }).catch(error => console.log(error));
    });

    //----------Start a conversation----//
    bot.on('postback:start', (payload, chat) => {
        const fbID = payload.sender.id;

        msg_me.isConnected(fbID)
            .then(connected => {
                if (connected)
                    chat.say("When you are in a conversation you can't start a new one.");
                else if (connected === 'false' || connected === false)
                    chat.conversation((convo) => {
                        convo.sendTypingIndicator(1000)
                            .then(() => connection.estConnection(convo, payload, bot))
                            .catch(error => console.log(error));
                    });
                else
                    chat.say("You need to create a user name first.")
                        .then(() => {
                            chat.conversation((convo) => {
                                convo.sendTypingIndicator(1000).then(() => newUser.createUser(convo, payload));
                            })
                        });

            }).catch(error => console.log(error));
    });

    //----------My User Name-----------//
    bot.on('postback:myName', (payload, chat) => {
        const fbID = payload.sender.id;

        msg_me.getMyName(fbID)
            .then(userName => {
                if (userName !== null)
                    chat.say(userName);
                else
                    chat.say("You need to create a user name first.")
                        .then(() => {
                            chat.conversation((convo) => {
                                convo.sendTypingIndicator(1000).then(() => newUser.createUser(convo, payload));
                            })
                        });
            })
    })

    console.log(`Initialized the postbacks.`);
};

module.exports = postback;