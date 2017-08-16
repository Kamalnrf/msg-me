/**
 * Created by kamalnrf.
 */

'use strict';

const msg_me = require('../app/msg-me');

const backGroundService = (bot) => {
    setInterval(deleteIdleConv, 1000);
};

function deleteIdleConv (){
    msg_me.getConnectedList()
        .then(list => {
            list.split(',')
                .map(senderID => {
                    msg_me.conectedTo(senderID)
                        .then(recieverID => {
                            msg_me.isIdle(senderID, recieverID)
                                .then(isIdle => {
                                    if (isIdle){
                                        bot.sendTextMessage(senderID, "It seems you are idle for a long time so we are closing the connection");
                                        bot.sendTextMessage(recieverID, "It seems you are idle for a long time so we are closing the connection");
                                        msg_me.disconnect(senderID, recieverID);
                                    }
                                })
                        })
                })
        })
}

module.exports = backGroundService;
