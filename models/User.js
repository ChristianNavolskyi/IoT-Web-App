const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	dateOfCreation: {
		type: Date,
		default: Date.now()
	},
	breath: [{
		time: {
			type: String,
			unique: false,
			index: false
		},
		value: Number
	}],
	lastEvaluation: String,
});


module.exports = User = mongoose.model("user", UserSchema);