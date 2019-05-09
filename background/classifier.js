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

function classifyBreath(user) {
	const lastEvaluationTimeNumber = parseInt(user.lastEvaluation);
	const lastBreathTimeString = user.breath[user.breath.length - 1].time;

	const breathData = user.breath
		.filter(breathData => parseInt(breathData.time) > lastEvaluationTimeNumber)
		.map(breathData => {
			return {time: parseInt(breathData.time), value: breathData.value}
		});

	if (breathData.length > 20) {
		if (classifyApnea(breathData)) {
			sendMessageToChats(user._id, {message: "Apnea detected"});
		}

		if (classifyAsthma(breathData)) {
			sendMessageToChats(user._id, {message: "Asthma detected"});
		}

		setLastEvaluation(user._id, lastBreathTimeString);
	} else {
		console.debug(`Length: ${breathData.length}. Not enough data to classify`);
	}
}

function classifyApnea(breathData) {
	const maxBreathValue = getMaxBreathValue(breathData);
	return maxBreathValue < 100000
}

function getMaxBreathValue(breathData) {
	return breathData.reduce((max, breath) => breath.value > max ? breath.value : max, breathData[0].value)
}

function classifyAsthma(breathData) {
	function getPeaks(breathData) {
		return breathData.reduce((acc, current, index, array) => {
			const breathValue = current.value;

			if (index > 0 && array.length > index + 1 && breathValue > 100000) {
				if (breathValue > array[index + 1].value && breathValue > array[index - 1].value) {
					return [...acc, current];
				}
			}

			return acc;
		}, []);
	}

	function getTimeDistances(peaks) {
		return peaks.reduce((acc, current, index, array) => {
			const timeValue = current.time;

			if (array.length > index + 1) {
				const nextTime = array[index + 1].time;
				return [...acc, nextTime - timeValue];
			}

			return acc;
		}, []);
	}

	function getAvgTimeDistance(timeDistances) {
		return timeDistances.reduce((acc, current) => {
			return acc + current;
		}, 0) / timeDistances.length;
	}

	const peaks = getPeaks(breathData);
	console.log(peaks);

	const timeDistances = getTimeDistances(peaks);
	console.log(timeDistances);

	const avgTimeDistance = getAvgTimeDistance(timeDistances);
	console.log(avgTimeDistance);

	return avgTimeDistance < 5000;
}


module.exports = {
	breathDataAdded: breathDataAdded
};