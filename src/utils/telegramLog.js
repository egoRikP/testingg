const { sendLogMessage } = require('../telegram_bot.js');

function handleError(message, error) {
    const errorMessage = `${message}: ${error.response ? `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}` : error.message}`;
    sendLogMessage(errorMessage);
    console.error(errorMessage);
    return new Error(errorMessage);
}

function handleSuccess(message) {
    sendLogMessage(message);
    console.log(message);
}

module.exports = {
    handleError,
    handleSuccess
};