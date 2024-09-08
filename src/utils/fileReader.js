const fs = require('fs');

function fileReader(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file from path: ${filePath}`);
    return null;
  }
}

module.exports = fileReader;