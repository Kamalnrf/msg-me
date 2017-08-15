/**
 * Created by kamalnrf
 */

'use strict';
const msg_me = require('../../msg-me');
const connection = require('./connection');

const newUser = {
    createUser (convo, payload){
        console.log("Creating new user");

        const question = "Please type a username you want to create for yourself.";

        const answer = (payload, chat) => {
            const fbID = payload.sender.id;
            const reqUserName = payload.message.text;

            msg_me.isExiting(reqUserName)
                .then(existense => {
                    console.log(`Requested username Existence: ${existense}`);
                    if (existense === false){
                        if (msg_me.createUser(fbID, reqUserName) === true)
                            convo.say(`Thanks for creating the username. Your username is ${reqUserName}. Share it among your friends!`)
                                .then(() => convo.sendTypingIndicator(5000).then(() => connection.estConnection(convo, payload, bot)));
                        else
                            convo.say(`There was some problem while creating your username`);
                    }else
                        convo.say(`We are sorry. It looks like this username is taken. Please try another one.`)
                            .then(() => this.createUser(convo, payload));
                })
                .catch(error => console.log(error));
        };

        convo.say("First, To get started you need to Create your Id. ;)")
            .then(() => convo.ask(question, answer));
    },
};

module.exports = newUser;