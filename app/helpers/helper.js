/**
 * Created by kamalnrf
 */
'use strict';

const msg_me = require('../msg-me');
const connection = require('../messenger/handlers/connection');
const newUser = require('../messenger/handlers/createUserOperator');
const feedback = require('../messenger/handlers/feedback');
const shrImage = require('../messenger/handlers/shrImage');


const helper = {
    basicErrorLog(error, chat){
        console.log(error);
        chat.say("Something went wrong tryagain");
    },

    chooseThePostback: (payload, chat) => {
        switch (payload.postback.payload){
        case '_stop':{
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
                });
            break;
        }

    case 'online/offline':{
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
            break;
        }
        case '_start':{
            const fbID = payload.sender.id;

            msg_me.isConnected(fbID)
                .then(connected => {
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

                }).catch(error => console.log(error));

            break;
        }
        case 'feedback':
            chat.conversation(convo => {
                convo.sendTypingIndicator(1000).then(() => feedback.sendFeedBack(payload, convo));
            });
            break;
        case 'myName': {
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
                });
            break;
        }
    }
}
};

module.exports = helper;