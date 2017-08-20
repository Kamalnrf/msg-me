/**
 * Created by kamalnrf
 */

'use strict';
const postbacks = require('../postback');

const feedBack = {
    sendFeedBack (payload, convo){
        const question = `Please tell us how to improve Chanun to help you better.`;

        const answer = (payload, chat) => {
            try {
                const feedback = payload.message.text;

                convo.say(`Thank you for feedback`)
                    .then(() => convo.end());
            }catch(error) {
                postbacks(bot);
                if (payload.postback.payload === 'feedback'){
                    convo.say(`You broke the conversation, try sending it again...`);
                }else
                    convo.say(`I'm afraid to say that something went please try again later`);
            }
        };

        convo.ask(question, answer);
    }
};

module.exports = feedBack;