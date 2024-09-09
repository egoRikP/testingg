const fs = require("fs");
const path = require('path');

const getTokens = (game) => {
    const secretPath = path.join('/etc/secrets', `${game}_tokens.txt`);
    if (fs.existsSync(secretPath)) {
        const data = fs.readFileSync(secretPath, 'utf-8');
        return data.split('\n').filter(line => line.trim() !== ''); // Розбиваємо рядки та фільтруємо пусті рядки
    } else {
        console.error(`Secret file not found: ${secretPath}`);
        return []; // Повертаємо порожній масив замість null
    }
};

// Треба реалізувати через віддалений сервер render.com з api + token
// const addToken = (game,token) => {
//     fs.appendFile(`./etc/secrets/${game}_tokens.txt`, token + '\n', (err) => {
//         if (err) {
//           console.error('Помилка при додаванні тексту до файлу:', err);
//         } else {
//           console.log('Текст успішно додано до файлу.');
//         }
//       });
// }

module.exports = {
    getTokens,
    // addToken
}