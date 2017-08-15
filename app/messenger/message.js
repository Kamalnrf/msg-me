/**
 * Created by kamalnrf
 */

"use strict";

const newUser = require('./handlers/createUserOperator');
const msg_me = require('../msg-me');
const connection = require('./handlers/connection');
const block = require('./handlers/block');

const message = (bot) => {

    bot.on('message', (payload, chat) => {
        console.log(payload);
        const message = payload.message.text;

        if (message === '#help')
            chat.say("#block - To block any user"+
                "\n#stop - To stop when you are in a conversation.(Note: doesn't work when you are not in a conversation)" +
                "\n#unblock - To unblock the user");
        else if (message === '#block')
            chat.conversation((convo) => {
                convo.sendTypingIndicator(1000)
                    .then(() => block.blockUser(convo, payload))
                    .catch(error => console.log(error));
            });
        else if (message === '#unblock')
            chat.conversation((convo) => {
                convo.sendTypingIndicator(1000)
                    .then(() => block.unblockUser(convo, payload))
                    .catch(error => console.log(error));
            });
        else
            msg_me.isExiting(payload.sender.id)
            .then(existence => {
                console.log(existence);
                if (existence === true ) {
                    msg_me.isConnected(payload.sender.id)
                        .then(connected => {
                            console.log(`Connection ${connected}`);
                            if (connected !== "true") {

                                chat.say("You need to establish a connection.")
                                    .then(() => {
                                        chat.conversation((convo) => {
                                            convo.sendTypingIndicator(1000)
                                                .then(() => connection.estConnection(convo, payload, bot))
                                                .catch(error => console.log(error));
                                        })
                                    })
                            }
                            else {
                                msg_me.conectedTo(payload.sender.id)
                                    .then(reciverID => {
                                        console.log('Sending message');
                                        if (message !== '#stop')
                                            bot.say(reciverID, message);
                                        else if (message === '#stop'){
                                            if (msg_me.disconnect(payload.sender.id, reciverID)){
                                                bot.say(reciverID, "Your connection has been closed");
                                                chat.say("Your connection has been closed");
                                            }
                                        }
                                    }).catch(error => console.log(error));
                            }
                        }).catch(error => console.log(error));
                }
                else
                    chat.say("It seems you haven't created a username for you yet.")
                        .then(() => {
                            chat.conversation((convo) => {
                                convo.sendTypingIndicator(1000).then(() => newUser.createUser(convo, payload));
                            })
                        })
            })
            .catch(error => console.log(error));
    });

    bot.on('attachment', (payload, chat) => {
        console.log('An attachment was received!');
        console.log(payload);
        chat.say("We don't support sending attachments yet...");
    });


    console.log("Listening to messages from user");

};

module.exports = message;