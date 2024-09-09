const {getConfig} = require("./../../utils/configHandler.js");
const {getTokens} = require("./../../utils/tokenHandler.js");
const fs = require("fs");
const path = require("path");
const cron = require('node-cron');

const {getConfig} = require("./utils/fileReader.js");
console.log(getConfig());

const {get, post} = require("./../../utils/axiosHandler.js");

get("https://jsonplaceholder.typicode.com/todos/1").then(e => {
    
})

const config = getConfig(__dirname);

function test() {
    console.log(getTokens(path.basename(__dirname)));
}

cron.schedule(`* * * * *`, test);

// test();