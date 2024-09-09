const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const {getTokens} = require("./utils/tokenHandler.js")

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

function handleAddTokenCommand(msg, match) {
    const chatId = msg.chat.id;
    const [_, tokenType, token] = match;

    if (isMessageFromAllowedGroup(msg)) {
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

  console.log(tokens);

  // Відправка повідомлення
  // bot.sendMessage(chatId, tokensText);
}

module.exports = {
    sendLogMessage,
};
