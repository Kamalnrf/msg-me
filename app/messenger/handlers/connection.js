/**
 * Created by kamalnrf
 */

'use strict';

const msg_me = require('../../msg-me');

const Connection = {
    estConnection (convo, payload, bot){
        console.log("Entered establishing connection");

        const question = "Enter the username you want to connect with.";

        const answer = (payload, chat) => {
            const userName = payload.message.text;
            const senderID = payload.sender.id;

            msg_me.isExiting(userName)
                .then(existense => {
                    //Checks if the usersname exists. if so finds the users fbID.
                    console.log(`User existence ${existense}`);
                    if (existense)
                        msg_me.findUser(userName)
                            .then(recieverID => {
                                console.log(`User recieverID ${recieverID}`);
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
                                                            chat.say(`We have established connection between you and ${userName}.`);
                                                            bot.say(recieverID, `A connection has been established`);
                                                            convo.end();
                                                        } else
                                                            convo.say("Something went wrong try again");
                                                    else
                                                        convo.say("The user you want to talk to is already in a conversation");
                                                })
                                                .catch(error => console.log(error));
                                        else
                                            convo.say ("The user you are trying to ping is not available.")
                                                .then(() => convo.end());
                                    });
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