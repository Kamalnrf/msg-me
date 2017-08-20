/**
 * Created by kamalnrf.
 */

'use strict';

const msg_me = require('../../msg-me');
const helper = require('../../helpers/helper');

const block = {
    blockUser (convo, payload){
        const question = "Enter the username you want to block.";

        const answer = (payload, chat) => {
            try {
                const userName = payload.message.text;
                const blockerID = payload.sender.id;

                msg_me.getFBID(userName)
                    .then(userId => {
                        msg_me.addBlocked(blockerID, userId);
                        convo.say(`Blocked the users ${userName}, from messaging you.`)
                            .then(() => convo.end());
                        msg_me.getMyName(blockerID)
                            .then(name => {
                                bot.sendTextMessage(userId, `You have been blocked to message ${name} `);
                            });
                    });
            }catch(error){
                helper.chooseThePostback(payload, chat);
            }
        };

        convo.ask(question, answer);
    },

    unblockUser (convo, payload){
        const question = "Enter the user name you want to unblock.";

        const answer = (payload, chat) => {
            const userID = payload.sender.id;
            const unblockerName = payload.message.text;

            msg_me.getFBID(unblockerName)
                .then(fbID => {
                    msg_me.unBlock(userID, fbID);
                    convo.say(`Unblocked the user ${unblockerName}.`)
                        .then(() => convo.end());
                    msg_me.getMyName(userID)
                        .then(name => {
                            bot.sendTextMessage(fbID, `${name} has unblocked you.`);
                        })
                })
        };

        convo.ask(question, answer);
    }
};

module.exports = block;