const sendMessageToChats = require("./telegram/TelegramNotifier");
const Users = require("../models/User");

function breathDataAdded(userId) {
	Users.findOne({_id: userId})
		.then(user => {
			const lastBreathTimeString = user.breath[user.breath.length - 1].time;

			console.log(user.lastEvaluation);
			if (!user.lastEvaluation) {
				setLastEvaluation(user._id, lastBreathTimeString);
			} else {
				const lastEvaluationTimeNumber = parseInt(user.lastEvaluation);
				const lastBreathTimeNumber = parseInt(lastBreathTimeString);

				classifyBreath(user);
				if (lastBreathTimeNumber - lastEvaluationTimeNumber > 30000) {
					classifyBreath(user);
				}
			}
		})
}

function setLastEvaluation(userId, lastBreathTime) {
	Users.updateOne({_id: userId}, {$set: {lastEvaluation: lastBreathTime}})
		.then(() => console.log("Successfully changed last evaluation time"))
		.catch(err => console.log(`Could not set last evaluation time. Error: ${err}`));
}

function classifyBreath(user) {
	const lastEvaluationTimeNumber = parseInt(user.lastEvaluation);
	const lastBreathTimeString = user.breath[user.breath.length - 1].time;

	const breathData = user.breath
		.filter(breathData => parseInt(breathData.time) > lastEvaluationTimeNumber)
		.map(breathData => {
			return {time: parseInt(breathData.time), value: breathData.value}
		});

	if (breathData.length > 200) {
		sendMessageToChats(user._id, {message: "Found Test"});
		setLastEvaluation(user._id, lastBreathTimeString);
	} else {
		console.debug("Not enough data to classify");
	}
}


module.exports = {
	breathDataAdded: breathDataAdded
};