const sendMessageToChats = require("./telegram/TelegramNotifier");
const Users = require("../models/User");

function breathDataAdded(userId) {
	Users.findOne({_id: userId})
		.then(user => {
			const lastBreathTimeString = user.breath[user.breath.length - 1].time;

			if (!user.lastEvaluation) {
				setLastEvaluation(user._id, lastBreathTimeString);
			} else {
				const lastEvaluationTimeNumber = parseInt(user.lastEvaluation);
				const lastBreathTimeNumber = parseInt(lastBreathTimeString);

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

function getMaxBreathValue(breathData) {
	return breathData.reduce((max, breath) => breath.value > max ? breath.value : max, breathData[0].value)
}

function classifyBreath(user) {
	const lastEvaluationTimeNumber = parseInt(user.lastEvaluation);
	const lastBreathTimeString = user.breath[user.breath.length - 1].time;

	const breathData = user.breath
		.filter(breathData => parseInt(breathData.time) > lastEvaluationTimeNumber)
		.map(breathData => {
			return {time: parseInt(breathData.time), value: breathData.value}
		});

	if (breathData.length > 20) {
		const maxBreathValue = getMaxBreathValue(breathData);
		let asthma = false;
		let apnea = false;

		console.log(`Max Breath is ${maxBreathValue}`);
		if (maxBreathValue < 100000) {
			console.log("Trigger apnea");
			apnea = true;
		}

		if (asthma) {
			sendMessageToChats(user._id, {message: "Asthma detected"});
		} else if (apnea) {
			sendMessageToChats(user._id, {message: "Apnea detected"});
		}
		setLastEvaluation(user._id, lastBreathTimeString);
	} else {
		console.debug(`Length: ${breathData.length}. Not enough data to classify`);
	}
}


module.exports = {
	breathDataAdded: breathDataAdded
};