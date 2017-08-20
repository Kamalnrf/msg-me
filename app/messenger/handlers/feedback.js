/**
 * Created by kamalnrf
 */

'use strict';
const postbacks = require('../postback');
const helper = require('../../helpers/helper');

const feedBack = {
    sendFeedBack (payload, convo){
        const question = `Please tell us how to improve Chanun to help you better.`;

        const answer = (payload, chat) => {
            try {
                const feedback = payload.message.text;

                convo.say(`Thank you for feedback`)
                    .then(() => convo.end());
            }catch(error) {
                helper.chooseThePostback(payload, chat);
                convo.end();
            }
        };

        convo.ask(question, answer);
    }
};

module.exports = feedBack;