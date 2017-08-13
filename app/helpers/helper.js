/**
 * Created by kamalnrf
 */
'use strict';

const helper = {
    basicErrorLog(error, chat){
        console.log(error);
        chat.say("Something went wrong tryagain");
    }
};

module.exports = helper;