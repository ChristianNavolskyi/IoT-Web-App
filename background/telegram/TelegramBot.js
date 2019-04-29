const TelegramBot = require("node-telegram-bot-api");
const token = require("../../config/keys").telegramToken;

console.log(`Telegram Token: ${token}`);
const bot = new TelegramBot(token);

module.exports = {
	Bot: bot
};