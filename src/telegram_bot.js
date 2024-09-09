const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const {getTokens} = require("./utils/tokenHandler.js")
const {put} = require("./utils/axiosHandler.js");

const groupId = process.env.TELEGRAM_GROUP; // Дозволена група
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
    sendLogMessage('Polling error: ' + error.message);
});
bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error);
    sendLogMessage('Webhook error: ' + error.message);
});

const sendLogMessage = (message) => {
    bot.sendMessage(groupId, message);
};

const isMessageFromAllowedGroup = (msg) => {
    return msg.chat.id === parseInt(groupId, 10);
};

const commandHandlers = {
    '/status': () => bot.sendMessage(groupId, 'Статус бота: працює'),
    '/tokens (hamster|blum)': handleTokenList,
    '/addToken (hamster|blum) "(.*)"': handleAddTokenCommand,
};

for (const [command, handler] of Object.entries(commandHandlers)) {
    bot.onText(new RegExp(`^${command}$`), (msg, match) => {
        if (isMessageFromAllowedGroup(msg)) {
            handler(msg, match);
        }
    });
}

async function handleAddTokenCommand(msg, match) {
    const chatId = msg.chat.id;
    const [_, tokenType, newToken] = match;
    const writableDir = path.join(__dirname, 'tokens'); // Writable directory
    const filePath = path.join(writableDir, `${tokenType}_tokens.txt`);

    if (isMessageFromAllowedGroup(msg)) {
        try {
            // Ensure the writable directory exists
            if (!fs.existsSync(writableDir)) {
                fs.mkdirSync(writableDir);
            }

            // Read existing tokens from the file
            const existingTokens = getTokens(tokenType);

            // Check for duplicate tokens (optional)
            if (existingTokens.includes(newToken)) {
                bot.sendMessage(chatId, `Токен "${newToken}" вже існує у файлі ${tokenType}_tokens.txt.`);
                return;
            }

            // Add new token to the array
            existingTokens.push(newToken);

            // Write updated token array to file
            fs.writeFileSync(filePath, existingTokens.join('\n') + '\n');

            bot.sendMessage(chatId, `Токен додано до файлу ${tokenType}_tokens.txt`);

            // PUT request to update the secret file content
            await put(
                `https://api.render.com/v1/services/srv-crf081bv2p9s73d3f9t0/secret-files/${tokenType}_tokens.txt.`,
                { content: newToken },
                { 'Authorization': 'Bearer rnd_wsXw35KPvjzPvEadqe669rnZMrGr', 'Content-Type': 'application/json' }
            );

            // POST request to restart the server
            await post(
                'https://api.render.com/v1/services/srv-crf081bv2p9s73d3f9t0/restart',
                {},
                { 'Authorization': 'Bearer rnd_wsXw35KPvjzPvEadqe669rnZMrGr' }
            );

            bot.sendMessage(chatId, `Секретний файл оновлено і сервер перезавантажено.`);

        } catch (error) {
            console.error("Error updating token file or making HTTP requests: ", error);
            sendLogMessage("Error updating token file or making HTTP requests: " + error.message);
            bot.sendMessage(chatId, 'Помилка при додаванні токена або запитах до API.');
        }
    }
}

function handleTokenList(msg, match) {
  const chatId = msg.chat.id;
  const tokenType = match[1];

  const tokens = getTokens(tokenType);

  // Перевірка на наявність токенів
  if (tokens.length === 0) {
      bot.sendMessage(chatId, `Токени для типу "${tokenType}" не знайдено.`);
      return;
  }

  // Перетворення масиву токенів в текстовий формат
  const tokensText = tokens.join('\n');

  // Перевірка на порожній текст
  if (tokensText.trim().length === 0) {
      bot.sendMessage(chatId, 'Токени не знайдені.');
      return;
  }

  // Відправка повідомлення
  bot.sendMessage(chatId, tokensText);
}

module.exports = {
    sendLogMessage,
};
