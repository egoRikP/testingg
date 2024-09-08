const {getConfig} = require("./../../utils/configHandler.js");
const {getTokens} = require("./../../utils/tokenHandler.js");
const fs = require("fs");
const cron = require('node-cron');


const config = getConfig(__dirname);

function test() {
    // console.log(config);
    console.log(getTokens("blum"));
}

cron.schedule(`* * * * *`, test);

test();