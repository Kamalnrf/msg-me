/**
 * Created by kamalnrf
 */

'use strict';
const msg_me = require('../../msg-me');
const connection = require('./connection');
const shrImage = require('./shrImage');
const helper = require('../../helpers/helper');

const newUser = {
    createUser (convo, payload){
        console.log("Creating new user");

        const question = "Enter your unique user ID";

        const answer = (payload, chat) => {
            try {
                const fbID = payload.sender.id;
                const reqUserName = payload.message.text.toLowerCase();

                msg_me.isExitingUser(reqUserName)
                    .then(existense => {
                        console.log(`Requested username Existence: ${existense}`);
                        if (existense === false) {
                            if (checkRules(reqUserName))
                                if (msg_me.createUser(fbID, reqUserName) === true) {
                                    convo.getUserProfile()
                                        .then((user) => {
                                            shrImage.genImage(user.profile_pic, reqUserName)
                                                .then(image => {
                                                    shrImage.getLink(image, reqUserName)
                                                        .then(link => {
                                                            console.log(link);
                                                            msg_me.saveImage(fbID, link);
                                                            convo.say({
                                                                attachment: 'image',
                                                                url: link
                                                            }).then(() => convo.say(`Thanks for creating the username. Your username is ${reqUserName}. Share it among your friends!`)
                                                                .then(() => convo.sendTypingIndicator(5000).then(() => connection.estConnection(convo, payload, bot))));
                                                        })
                                                });
                                        });
                                }
                                else
                                    convo.say(`There was some problem while creating your username`);
                            else
                                convo.say("The name you choose doesn't comply with our naming convention.")
                                    .then(() => this.createUser(convo, payload));
                        } else
                            convo.say(`We are sorry. It looks like this username is taken. Please try another one.`)
                                .then(() => this.createUser(convo, payload));
                    })
                    .catch(error => console.log(error));
            }catch (error){
                helper.chooseThePostback(payload, chat);
                convo.end();
            }
        };


        convo.say("First, To get started you need to Create your User Id. ;)")
            .then(() => convo.ask(question, answer));
    },
};

function checkRules (userName){
    if (userName.length >= 5)
        if (userName.indexOf(' ') <= 0)
            if ((userName.search('.net') || userName.search('.com')) === -1)
                return true;

    return false;
}

module.exports = newUser;