const {getConfig} = require("./../../utils/configHandler.js");
const {getTokens} = require("./../../utils/tokenHandler.js");
const fs = require("fs");
const path = require("path");
const cron = require('node-cron');

const config = getConfig(__dirname);

function test() {
    console.log(getTokens(path.basename(__dirname)));
}

cron.schedule(`* * * * *`, test);

test();