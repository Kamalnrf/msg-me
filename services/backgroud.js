/**
 * Created by kamalnrf.
 */

'use strict';

const msg_me = require('../app/msg-me');

const backGroundService = (bot) => {
    setInterval(deleteIdleConv, 300000);

    console.log("Started all the services.")
};

function deleteIdleConv (){
    console.log(`Current time: ${(new Date()).getMinutes()}`);
    msg_me.getConnectedList()
        .then(list => {
            list.split(',')
                .map(senderID => {
                    if (senderID !== 'def' || senderID !== 'null')
                        msg_me.conectedTo(senderID)
                            .then(recieverID => {
                                msg_me.isIdle(senderID, recieverID)
                                    .then(isIdle => {
                                        if (isIdle) {
                                            console.log(`isIdle: ${isIdle}`);
                                            bot.sendTextMessage(senderID, "It seems you are idle for a long time so we are closing the connection");
                                            bot.sendTextMessage(recieverID, "It seems you are idle for a long time so we are closing the connection");
                                            msg_me.disconnect(senderID, recieverID);
                                        }
                                    })
                            })
                            .catch(error => {

                            })
                })
        })
}

module.exports = backGroundService;
