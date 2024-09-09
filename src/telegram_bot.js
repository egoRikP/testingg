const TelegramBot = require('node-telegram-bot-api');
const fs = require("fs");
const path = require('path');

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

// bot.onText(/\/tokens (hamster|blum)/, handleTokenList);
// bot.onText(/\/addToken (hamster|blum) "(.*)"/, handleAddTokenCommand);

const sendLogMessage = (message) => {
    bot.sendMessage(groupId, message);
};

const commandHandlers = {
    '/status': () => bot.sendMessage(chatId, 'Статус бота: працює'),
    '/\/tokens (hamster|blum)/' : handleTokenList,
    '/\/addToken (hamster|blum) "(.*)"/' : handleAddTokenCommand
};

for (const [command, handler] of Object.entries(commandHandlers)) {
    bot.onText(new RegExp(`^${command}$`), handler);
}

function handleAddTokenCommand(msg, match) {
  const chatId = msg.chat.id;
  console.log('Received /addToken command');
  const [_, tokenType, token] = match;
  console.log("TokenType:", tokenType);
  console.log("Token:", token);

  const filePath = path.join(__dirname, `${tokenType}_tokens.txt`);

  try {
    // Додавання нового токена в кінець файлу
    fs.appendFileSync(filePath, token + '\n');
    bot.sendMessage(chatId, `Токен додано до файлу ${tokenType}_tokens.txt`);
  } catch (error) {
    console.error("Error writing token to file: ", error);
    sendLogMessage("Error writing token to file: " + error.message);
    bot.sendMessage(chatId, 'Помилка при додаванні токена.');
  }
}

const getTokensFromFile = (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf8').trim().split('\n');
    } catch (error) {
        console.error("Error reading tokens from file: ", error);
        sendLogMessage("Error reading tokens from file: " + error.message);
        process.exit(1);
    }
};


// function handleStatusCommand(msg) {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'Статус бота: працює');
// }

function handleTokenList(msg, match) {
  const chatId = msg.chat.id;
  const tokenType = match[1]; // Отримуємо параметр з команди
  console.log(tokenType);
  // Визначаємо шлях до файлу на основі типу токена
  const filePath = path.join(__dirname, `${tokenType}_tokens.txt`);

  // Перевіряємо, чи існує файл
  if (!fs.existsSync(filePath)) {
      bot.sendMessage(chatId, `Файл для типу токенів "${tokenType}" не знайдено.`);
      return;
  }

  let tokens = getTokensFromFile(filePath);
  let tokenstext = '';

  tokens.forEach((token) => {
      tokenstext += token + '\n' + '\n';
  });

  sendLogMessage(tokenstext);
}

module.exports = {
  sendLogMessage,
};