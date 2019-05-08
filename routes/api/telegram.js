// Express for routing
const express = require("express");
const router = express.Router();

// Classification
const notifyDataAdded = require("../../background/classifier").breathDataAdded;

// Telegram
const TelegramListener = require("../../models/TelegramListeners");
const sendMessageToChats = require("../../background/telegram/TelegramNotifier");


router.get("/", (req, res) => {
	TelegramListener.find()
		.then(listeners => {
			res.json(listeners)
		})
});

router.post("/", (req, res) => {
	if ("userId" in req.body && "message" in req.body) {
		const userId = req.body.userId;

		sendMessageToChats(userId, req.body);
	}
});


module.exports = router;