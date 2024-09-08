const path = require('path');
const fileReader = require('./fileReader.js');

function getConfig(currentDir) {
  const configFilePath = path.join(currentDir, `${path.basename(currentDir)}_config.json`);
  return fileReader(configFilePath);
}

module.exports = {getConfig};