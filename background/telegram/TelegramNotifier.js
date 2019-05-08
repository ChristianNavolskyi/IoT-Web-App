const bot = require("./TelegramBot").Bot;
const TelegramListener = require("../../models/TelegramListeners");

const sendMessageToChats = (userId, message) => {

	TelegramListener.find({userIds: userId})
		.then(listeners => {
			notifyListeners(listeners);
		})
		.catch(err => {
			console.error(`Could not find listeners for user. Got error: ${err}`);
		});

	function notifyListeners(listeners) {
		if (listeners.length > 0) {
			const chatIds = listeners.map(listener => listener.chatId);
			if (chatIds.length > 0) {
				sendMessageToListeners(chatIds, message);
			} else {
				console.error("Could not find listeners for user.");
			}
		} else {
			console.error("Could not find listeners for user.");
		}
	}

	function sendMessageToListeners(chatIds, message) {
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
	}
};

module.exports = sendMessageToChats;