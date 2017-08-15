/**
 * Created by kamalnrf
 */

'use strict';

const feedBack = {
    sendFeedBack (payload, convo){
        const question = `Please tell us how to improve Chanun to help you better.`;

        const answer = (payload, chat) => {
            const feedback = payload.message.text;

            convo.say(`Thank you for feedback`)
                .then(() => convo.end());
        };

        convo.ask(question, answer);
    }
};

module.exports = feedBack;