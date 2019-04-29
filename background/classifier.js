const sendMessageToChats = require("./telegram/TelegramNotifier");
const Users = require("../models/User");

function breathDataAdded(userId) {
	Users.findOne({_id: userId})
		.then(user => {
			const currentTime = new Date().getTime();

			user.lastEvaluation
		})
}


module.exports = {
	breathDataAdded: breathDataAdded
};