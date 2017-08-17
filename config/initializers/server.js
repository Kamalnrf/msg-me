/**
 * Created by kamalnrf
 */

'use strict';

const start = (bot) => {
    bot.app.get('/', (req, res) => {
        res.send("{status:true}");
    });


    //Starts the bot
    bot.start(process.env.PORT || 8000)
};

module.exports = start;