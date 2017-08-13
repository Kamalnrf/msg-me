/**
 * Created by kamalnrf
 */

'use strict';

const newUser = require('../../app/messenger/handlers/createUserOperator');

const setup = (bot) => {
    /**
     * Getting started message and action to show message before clicking and action for after clicking
     * get started button.
     */
    bot.setGreetingText("Welcome to msg-me");
    bot.setGetStartedButton((payload, chat) => {
        console.log(`New user! \n ${payload}`);
        chat.getUserProfile()
            .then(user => {
                chat.say("Hi " + user.first_name + ", Good to see you")
                    .then(() => {
                        chat.conversation((convo) => {
                            convo.sendTypingIndicator(1000).then(() => newUser.createUser(convo, payload));
                        })
                    })
            });
    });

    bot.setPersistentMenu([
        {
            title: 'My username',
            type: 'postback',
            payload: 'myName'
        },

        {
            title: 'Online/Offline',
            type: 'postback',
            payload: 'online/offline'
        },

        {
            title: 'Start a conversation',
            type: 'postback',
            payload: 'start'
        }
    ]);

    console.log("Completed the basic setUp");
};

module.exports = setup;