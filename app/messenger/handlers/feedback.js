/**
 * Created by kamalnrf
 */

'use strict';

const feedBack = {
    sendFeedBack (payload, convo){
        const question = `Please tell us how to improve Chanun to help you better.`;

        const answer = (payload, chat) => {
            try {
                const feedback = payload.message.text;

                convo.say(`Thank you for feedback`)
                    .then(() => convo.end());
            }catch(error) {
                if (payload.postback.payload === 'feedback'){
                    convo.say(`You broke the conversation, try sending it again...`);
                }
                convo.say(`I'm afraid to say that something went please try again later`);
            }
        };

        convo.ask(question, answer);
    }
};

module.exports = feedBack;