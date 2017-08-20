/**
 * Created by kamalnrf
 */

'use strict';
const msg_me = require('../../msg-me');

const queue = {
    addQueue (convo, payload, reqUser){
        const question = {
            text: "Would you like to be notified when he is free to talk?",
            quickReplies: ['Yes', 'No']
        };

        const answer = (payload, chat) => {
            try {
                const senderID = payload.sender.id;
                const reply = payload.message.text;

                if (reply === 'Yes' || reply === 'yes') {
                    msg_me.addQueue(senderID, reqUser);
                    convo.say("You will be notified when the user is back online")
                        .then(() => convo.end());
                }
                else
                    convo.say("OK")
                        .then(() => convo.end());
            }catch (error) {
                convo.say(`I'm afraid to say that something went wrong, please try again later`);
            }
        };

        convo.ask(question, answer);
    }
};

module.exports = queue;