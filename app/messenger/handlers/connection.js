/**
 * Created by kamalnrf
 */

'use strict';

const msg_me = require('../../msg-me');
const queue = require('./queue');

const Connection = {
    estConnection (convo, payload, bot){
        console.log("Entered establishing connection");

        const question = "Please Enter the username you want to talk to.";

        const answer = (payload, chat) => {
            const userName = payload.message.text.toLowerCase();
            const senderID = payload.sender.id;

            msg_me.isExitingUser(userName)
                .then(existense => {
                    //Checks if the usersname exists. if so finds the users fbID.
                    console.log(`User existence ${existense}`);
                    if (existense === 'true' || existense === true)
                        msg_me.whatIsOnHold(senderID)
                            .then(onHold => {
                                if (onHold === '-1'){
                                    msg_me.findUser(userName)
                                        .then(recieverID => {
                                            console.log(`User recieverID ${recieverID}`);
                                            msg_me.whatIsOnHold(recieverID)
                                                .then(onHold => {
                                                  if (onHold === '-1') {
                                                      if (senderID === recieverID)
                                                          convo.say(`Heights of loneliness, go and stand infront of mirror `)
                                                              .then(() => convo.end());
                                                      else
                                                          msg_me.isBlocked(senderID, recieverID)
                                                              .then(isBlocked => {
                                                                  if (isBlocked === false)
                                                                      msg_me.isOnline(recieverID)
                                                                          .then(isOnline => {
                                                                              console.log(`Is user online ${isOnline}`);
                                                                              //Checks whether the user is online.
                                                                              if (isOnline === 'true' || isOnline === true)
                                                                                  msg_me.isConnected(recieverID)
                                                                                      .then(conected => {
                                                                                          console.log(`Connected: ${conected}`);
                                                                                          //Checks if the user is not connected to anyone.
                                                                                          if (conected === false || conected === "false") {
                                                                                              msg_me.estRequest(senderID, recieverID)
                                                                                                  .then(reuested => {
                                                                                                      if (reuested === true) {
                                                                                                          const buttons = [
                                                                                                              {
                                                                                                                  type: 'postback',
                                                                                                                  title: 'Yes',
                                                                                                                  payload: 'REQ_YES'
                                                                                                              },
                                                                                                              {
                                                                                                                  type: 'postback',
                                                                                                                  title: 'No',
                                                                                                                  payload: 'REQ_NO'
                                                                                                              }
                                                                                                          ];
                                                                                                          chat.say(`We have sent the connection request`);
                                                                                                          bot.sendButtonTemplate(recieverID, 'Some wants to talk to you. Would you like to connect?', buttons);
                                                                                                          convo.end();
                                                                                                      } else
                                                                                                          convo.say("Something went wrong try again");

                                                                                                  });
                                                                                          }
                                                                                          else
                                                                                              convo.say(`We’re sorry! It looks like ${userName} is connected with someone else.`)
                                                                                                  .then(() => convo.sendTypingIndicator(1000)
                                                                                                      .then(() => queue.addQueue(convo, payload, recieverID))
                                                                                                      .catch(error => console.log(error)));
                                                                                      })
                                                                                      .catch(error => console.log(error));
                                                                              else
                                                                                  convo.say(`We’re sorry! It looks like ${userName} is offline.`)
                                                                                      .then(() => convo.sendTypingIndicator(1000)
                                                                                          .then(() => queue.addQueue(convo, payload, recieverID))
                                                                                          .catch(error => console.log(error)));
                                                                          });
                                                                  else if (isBlocked === true)
                                                                      convo.say(`I'm sorry this user has blocked you`)
                                                                          .then(() => convo.end);
                                                              });
                                                  } else {
                                                      convo.say(`The user you want to talk already has a request. try someone else.`)
                                                          .then(() => convo.end());
                                                  }
                                                })
                                        })
                                        .catch(errors => {
                                            console.log(errors);
                                        });
                                }else {
                                    convo.say(`You cant start a new conversation when there is a request`);
                                }
                            });
                    else {
                        convo.say("There is no such user, try entering again.")
                            .then(() => this.estConnection(convo, payload, bot));
                    }
                })
                .catch(error => console.log(error))
        };

        convo.ask(question, answer);
    }
};
module.exports = Connection;