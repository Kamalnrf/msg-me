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
                chat.say(`Hi  ${user.first_name} Greetings for the day! My friends call me Chanon bot. I’m here to let you talk with your friends anonymously. At any point of conversation type “#help” to know secret keywords.`)
                    .then(() => {
                        chat.conversation((convo) => {
                            convo.sendTypingIndicator(2000).then(() => newUser.createUser(convo, payload));
                        })
                    })
            });
    });

    bot.setPersistentMenu([
        {
            title: 'Online/Offline',
            type: 'postback',
            payload: 'online/offline'
        },

        {
            title: 'My username',
            type: 'postback',
            payload: 'myName'
        }
    ]);

    console.log("Completed the basic setUp");
};

module.exports = setup;