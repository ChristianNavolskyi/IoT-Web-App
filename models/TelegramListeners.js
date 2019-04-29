const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TelegramListenerSchema = new Schema({
	id: {
		type: Number,
		required: true
	},
	chatId: {
		type: Number,
		required: true
	},
	firstName: String,
	lastName: String,
	listenerIds: [{
		type: String
	}]
});


module.exports = TelegramListener = mongoose.model("telegram-listener", TelegramListenerSchema);