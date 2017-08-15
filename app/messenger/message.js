/**
 * Created by kamalnrf
 */

"use strict";

const newUser = require('./handlers/createUserOperator');
const msg_me = require('../msg-me');
const connection = require('./handlers/connection');

const message = (bot) => {

    bot.on('message', (payload, chat) => {
        console.log(payload);
        const message = payload.message.text;

        msg_me.isExiting(payload.sender.id)
            .then(existence => {
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
                                        if (message !== 'end!')
                                            bot.say(reciverID, message);
                                        else if (message === 'end!'){
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