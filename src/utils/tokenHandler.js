const fs = require("fs");

const getTokens = (game) => {
    try {
        return fs.readFileSync(`/etc/secrets/${game}_tokens.txt`, 'utf8').trim().split('\n');
    } catch (error) {
        console.error("Error reading tokens from file: ", error);
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