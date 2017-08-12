/**
 * Created by kamalnrf
 */

'use strict';
const msg_me = require('../../msg-me');

const newUser = {
    createUser (convo, payload){
        console.log("Creating new user");

        const question = "Enter the username you want";

        const answer = (payload, chat) => {
            const fbID = payload.sender.id;
            const reqUserName = payload.message.text;

            msg_me.isExiting(reqUserName)
                .then(existense => {
                    console.log(`Requested username Existence: ${existense}`);
                    if (existense === false){
                        if (msg_me.createUser(fbID, reqUserName) === true)
                            convo.say(`Created your username.`);
                        else
                            convo.say(`There was some problem while creating your username`);
                    }else
                        convo.say(`This user name is not available select another one`)
                            .then(() => this.createUser(convo, payload));
                })
                .catch(error => console.log(error));
        };

        convo.ask(question, answer);
    },
};

module.exports = newUser;