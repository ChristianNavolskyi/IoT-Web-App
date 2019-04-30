const bot = require("./TelegramBot").Bot;

const sendMessageToChats = (chatIds, message) => {
	chatIds.forEach(chat => {
		if ("message" in message) {
			bot.sendMessage(chat, message.message);
		}

		if ("longitude" in message && "latitude" in message) {
			bot.sendLocation(chat, message.latitude, message.longitude)
		}

		if ("image" in message) {
			bot.sendPhoto(chat, message.image)
		}
	})
};

module.exports = sendMessageToChats;