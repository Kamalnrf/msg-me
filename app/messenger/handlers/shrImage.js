/**
 * Created by kamalnrf
 */

'use strict';

const Jimp = require('jimp');
const imgur = require('imgur-uploader');

const chanon = 'chanon.jpg';
const plusX = 390, plusY = 226;

const shrImage = {

    async genImage (profileDP, userName){
        try {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const staticImage = await Jimp.read(chanon);
            const userNamePrinted = await staticImage.print(font, 501, 507, userName);
            let dp = await Jimp.read(profileDP);
            dp = await dp.resize(260, 260);

            await dp.scan(0, 0, dp.bitmap.width, dp.bitmap.height, (x, y, idx) => {
                const hex = dp.getPixelColor(x, y);

                userNamePrinted.setPixelColour(hex, plusX + x, plusY + y);
            });

            let buf;
            await userNamePrinted.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
                buf = buffer;
            });

            return buf;
        }catch (error) {
            console.log(error);
        }
    },

    async getLink (imageBuffer, userName){
        try {
            const data = await imgur(imageBuffer, {title: userName});

            return data.link;
        }catch (error) {
            console.log(error);
        }
    }


};

module.exports = shrImage;