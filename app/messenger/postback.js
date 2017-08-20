/**
 * Created by kamalnrf
 */

'use strict';

const msg_me = require('../msg-me');
const connection = require('./handlers/connection');
const newUser = require('./handlers/createUserOperator');
const feedback = require('./handlers/feedback');
const shrImage = require('./handlers/shrImage');

const postback = (bot) => {
    bot.on('postback', (payload, chat) => {
       console.log(payload);

       if (payload.postback.payload === '_stop') {
           const fbID = payload.sender.id;

           msg_me.isConnected(fbID)
               .then(connected => {
                   if (connected === 'true' || connected === true)
                       msg_me.conectedTo(fbID)
                           .then(recieverID => {
                               msg_me.disconnect(fbID, recieverID);

                               chat.say(`Conversation has ended`);
                               bot.say(recieverID, `Conection has been ended.`);
                           });
                   else
                       chat.say(`You have to be in a conversation to stop a conversation`);
               })
       }
    });

    bot.on('postback:REQ_YES', (payload, chat) => {
        console.log(payload);
        const senderID = payload.sender.id;

        msg_me.whatIsOnHold(senderID)
            .then(recieverID => {
                if (recieverID !== '-1') {
                    if (msg_me.connect(senderID, recieverID) === true) {
                        chat.say(`A connection has been established.If at any point you feel like closing the connection send '#stop'`);
                        bot.say(recieverID, `A connection has been established.If at any point you feel like closing the connection send '#stop'`);
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
    //----------Online/Offline--------//
    bot.on('postback:online/offline', (payload, chat) => {
        console.log(payload);

        const fbID = payload.sender.id;

        msg_me.isOnline(fbID)
            .then(isOnline => {
                console.log(`isOnline ${isOnline}\nType: ${typeof isOnline}`);
                if (isOnline === 'true' || isOnline === true) {
                    msg_me.turnOffline(fbID)
                        .then(result => result ? chat.say("You’re now Offline. Friends will not be able to connect with you. Please turn back to Online if you want to chat anonymously with your friends.") : chat.say("Something went wrong tryagain"));
                }
                else if (isOnline === false || isOnline === "false") {
                    msg_me.turnOnline(fbID)
                        .then(result => result ? chat.say("You’re now Online. Hold on! Any friend of yours maybe contacting you soon.") : chat.say("Something went wrong tryagain"));

                    msg_me.getAllQueuedUsers(fbID)
                        .then(queuedUsers => {
                            console.log(queuedUsers);
                            queuedUsers.map(element => {
                                msg_me.getMyName(fbID)
                                    .then(name => {
                                        console.log(element);
                                        bot.sendTextMessage(element, `${name} is online. Now you can connect with him.`);
                                    });
                            });
                        });

                    msg_me.removeQueuedUsers(fbID);
                }
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
    bot.on('postback:start-conversation', (payload, chat) => {
        console.log(payload);

        const fbID = payload.sender.id;

        msg_me.isConnected(fbID)
            .then(connected => {
                try {
                    if (connected === 'true' || connected === true)
                        chat.say("When you are in a conversation you can't start a new one.");
                    else if (connected === 'false' || connected === false)
                        chat.conversation((convo) => {
                            convo.sendTypingIndicator(1000)
                                .then(() => connection.estConnection(convo, payload, bot))
                                .catch(error => console.log(error));
                        });
                    else
                        chat.say("You need to create a username first.")
                            .then(() => {
                                chat.conversation((convo) => {
                                    convo.sendTypingIndicator(1000).then(() => newUser.createUser(convo, payload));
                                })
                            });
                }catch (error){
                    chat.say('Seems like something went wrong, try sending a message...');
                }

            }).catch(error => console.log(error));
    });

    //----------My User Name-----------//
    bot.on('postback:myName', (payload, chat) => {
        console.log(payload);

        const fbID = payload.sender.id;

        msg_me.getMyName(fbID)
            .then(userName => {
                if (userName !== null) {
                    msg_me.getMyImage(fbID)
                        .then(link => {
                            if (link === null || link === undefined) {
                                console.log(`link is null`);
                                chat.getUserProfile()
                                    .then((user) => {
                                        shrImage.genImage(user.profile_pic, userName)
                                            .then(image => {
                                                shrImage.getLink(image, userName)
                                                    .then(link => {
                                                        console.log(link);
                                                        msg_me.saveImage(fbID, link);
                                                        chat.say({
                                                            attachment: 'image',
                                                            url: link
                                                        });
                                                        chat.say(`Your username is ${userName}. Share it with your friends.`);
                                                    })
                                            });
                                    });
                            }
                            else {
                                chat.say({
                                    attachment: 'image',
                                    url: link
                                }).then(() => chat.say(`Your username is ${userName}. Share it with your friends.`));
                            }
                        });
                }
                else
                    chat.say("You need to create a username first.")
                        .then(() => {
                            chat.conversation((convo) => {
                                convo.sendTypingIndicator(1000).then(() => newUser.createUser(convo, payload));
                            })
                        });
            })
            .catch(error => {
                console.log(error);
                chat.say("You need to create a username first.")
                    .then(() => {
                        chat.conversation((convo) => {
                            convo.sendTypingIndicator(1000).then(() => newUser.createUser(convo, payload));
                        })
                    });
            })
    });

    //----------Feedback----------//
    bot.on('postback:feedback', (payload, chat) => {
       console.log(payload);

       try {

           chat.conversation(convo => {
               convo.sendTypingIndicator(1000).then(() => feedback.sendFeedBack(payload, convo));
           })
       }catch (error){

       }
    });

    console.log(`Initialized the postbacks.`);
};

module.exports = postback;