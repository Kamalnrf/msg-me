/**
 * Created by kamalnrf
 */

'use strict';

const msg_me = require('../../msg-me');
const queue = require('./queue');

const Connection = {
    estConnection (convo, payload, bot){
        console.log("Entered establishing connection");

        const question = "Please Enter the username you want to talk to.";

        const answer = (payload, chat) => {
            const userName = payload.message.text;
            const senderID = payload.sender.id;

            msg_me.isExitingUser(userName)
                .then(existense => {
                    //Checks if the usersname exists. if so finds the users fbID.
                    console.log(`User existence ${existense}`);
                    if (existense === 'true' || existense === true)
                        msg_me.findUser(userName)
                            .then(recieverID => {
                                console.log(`User recieverID ${recieverID}`);
                                if (senderID === recieverID)
                                    convo.say(`Heights of loneliness, go and stand infront of mirror `)
                                        .then(() => convo.end());
                                else
                                    msg_me.isBlocked(senderID, recieverID)
                                        .then(isBlocked => {
                                            if (isBlocked === false)
                                                msg_me.isOnline(recieverID)
                                                    .then(isOnline => {
                                                        console.log(`Is user online ${isOnline}`);
                                                        //Checks whether the user is online.
                                                        if (isOnline === 'true' || isOnline === true)
                                                            msg_me.isConnected(recieverID)
                                                                .then(conected => {
                                                                    console.log(`Connected: ${conected}`);
                                                                    //Checks if the user is not connected to anyone.
                                                                    if (conected === false || conected === "false")
                                                                        if (msg_me.connect(senderID, recieverID) === true) {

                                                                            chat.say(`We have established connection between you and ${userName}.`)
                                                                                .then(() => chat.say(`If at any point you feel like ending the conversation send '#stop'`)
                                                                                    .then(() => chat.say("Say hello to start the conversation.")));
                                                                            bot.say(recieverID, `A connection has been established between you and someone who wants to talk to you anonymously.\nIf at any point you feel like ending the conversation send '#stop'`)
                                                                                .then(() => bot.say(recieverID, "Say hello to start the conversation."));
                                                                            convo.end();

                                                                        } else
                                                                            convo.say("Something went wrong try again");
                                                                    else
                                                                        convo.say (`We’re sorry! It looks like ${userName} is connected with someone else.`)
                                                                            .then(() =>  convo.sendTypingIndicator(1000)
                                                                                .then(() => queue.addQueue(convo, payload, recieverID))
                                                                                .catch(error => console.log(error)));
                                                                })
                                                                .catch(error => console.log(error));
                                                        else
                                                            convo.say (`We’re sorry! It looks like ${userName} is offline.`)
                                                                .then(() =>  convo.sendTypingIndicator(1000)
                                                                    .then(() => queue.addQueue(convo, payload, recieverID))
                                                                    .catch(error => console.log(error)));
                                                    });
                                            else if (isBlocked === true)
                                                convo.say(`I'm sorry this user has blocked you`);
                                        })
                            })
                            .catch(errors => {
                                console.log(errors);
                            });
                    else {
                        convo.say("There is no such user, try entering again.")
                            .then(() => this.estConnection(convo, payload, bot));
                    }
                })
                .catch(error => console.log(error))
        };

        convo.ask(question, answer);
    }
};
module.exports = Connection;