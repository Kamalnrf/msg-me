/**
 * Created by kamalnrf.
 */

'use strict';

const msg_me = require('../app/msg-me');
const axios  = require('axios');

const backGroundService = (bot) => {
    setInterval(deleteIdleConv, 900000);

    setInterval(callMyself, 900000);

    console.log("Started all the services.")
};

function callMyself() {
    axios.get('https://radiant-beyond-89697.herokuapp.com/')
        .then(data => console.log(data))
}
function deleteIdleConv (){
    console.log(`Current time: ${(new Date()).getMinutes()}`);
    msg_me.getConnectedList()
        .then(list => {
            list.split(',')
                .map(senderID => {
                    console.log(`SenderID: ${senderID}`);
                        msg_me.conectedTo(senderID)
                            .then(recieverID => {
                                console.log(`RecieverID: ${recieverID}`);
                                msg_me.isIdle(senderID, recieverID)
                                    .then(isIdle => {
                                        console.log(`Is idle ${isIdle}`);
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
