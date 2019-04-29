// Express for routing
const express = require("express");
const router = express.Router();

// Classification
const notifyDataAdded = require("../../background/classifier").breathDataAdded;

// Telegram
const TelegramListener = require("../../models/TelegramListeners");
const sendMessageToChats = require("../../background/telegram/TelegramNotifier");


// @route 	POST api/users
// @desc 	Create a user
// @access 	Public
router.post("/", (req, res) => {
	function notifyListeners(listeners) {
		if (listeners.length > 0) {
			const chatIds = listeners.map(listener => listener.chatId);

			sendMessageToChats(chatIds, req.body);
			res.json({success: true, chatIds: chatIds})
		} else {
			console.error("Could not find listeners for user.");
			res.json({success: false, message: "No listeners found for patient"})
		}
	}

	if ("userId" in req.body && "message" in req.body) {
		const userId = req.body.userId;

		TelegramListener.find({listenerIds: userId})
			.then(listeners => {
				notifyListeners(listeners);
			})
			.catch(err => {
				console.error(`Could not find listeners for user. Got error: ${err}`);
				res.status(404).json({success: false})
			})
	}
});


module.exports = router;