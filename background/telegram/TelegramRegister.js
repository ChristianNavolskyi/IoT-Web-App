const bot = require("./TelegramBot").Bot;
const TelegramListener = require("../../models/TelegramListeners");
const Users = require("../../models/User");


const setup = () => {
	function sendRegisterFirstMessage(chatId) {
		bot.sendMessage(chatId, "You have to sign up first.", {
			"reply_markup": {
				"keyboard": [["/start"]]
			}
		});
	}

	bot.startPolling()
		.then(console.log("Polling started successfully"))
		.catch(err => console.error(`Could not start polling got ${err}`));

	bot.onText(/\/start/, (message) => {
		function addListener() {
			const newListener = new TelegramListener({
				id: message.from.id,
				chatId: message.chat.id,
				firstName: message.from.first_name,
				lastName: message.from.last_name
			});

			newListener.save()
				.then(listener => {
					console.debug(`New user: ${listener.id}`);
					bot.sendMessage(listener.id, "Welcome in our life saviour system. " +
						"When something happens you will be notified first. " +
						"But first you have to register a patient so you get notifications from him.");
				})
				.catch(err => {
					console.error(`Could not save user: ${err}`);
					bot.sendMessage(message.chat.id, "You could not be added to the system. Please try again later.");
				});
		}

		TelegramListener.findOne({id: message.from.id})
			.then(user => {
				console.log(user);
				bot.sendMessage(user.chatId, "Welcome back again.")
			})
			.catch(() => {
				addListener();
			});
	});

	bot.onText(/\/remove/, (message) => {
		TelegramListener.deleteOne({id: message.from.id})
			.then(res => {
				if (res.deletedCount > 0) {
					console.debug(`Delete one user: ${message.from.id}`);
					bot.sendMessage(message.chat.id, "We will remove you from our system.");
				} else {
					console.debug(`Not present user tried to remove himself: ${JSON.stringify(message.from, null, 2)}`)
				}
			})
			.catch(err => {
				console.debug(`Could not delete user: ${JSON.stringify(err, null, 2)}`);
			});
	});

	bot.onText(/\/register ([0-9]([a-z]|[0-9])*)/, (message, match) => {
		const listenerId = message.from.id;
		const userId = match[1];

		function registerUserToListener(listener, user) {
			if (listener.listenerIds.includes(userId)) {
				bot.sendMessage(message.chat.id, `You are already registered for update from ${user.name}`)
			} else {
				TelegramListener.updateOne({_id: listener._id},
					{"$push": {listenerIds: userId}})
					.then(() => {
						bot.sendMessage(message.chat.id, `You have successfully registered for notifications from ${user.name}`)
					})
					.catch(err => {
						bot.sendMessage(message.chat.id, `Could not register for updates from ${user.name}`)
						console.error(`Error while registering ${JSON.stringify(listener, null, 2)} for patient ${user.name}. Got ${err}`);
					});
			}
		}

		TelegramListener.findOne({id: listenerId})
			.then(listener => {
				if (listener) {
					Users.findOne({_id: userId})
						.then(user => {
							registerUserToListener(listener, user);
						})
						.catch(err => {
							bot.sendMessage(message.chat.id, "Could not find user for this id.");
							console.error(`Could not find user for id. Got ${err}`);
						});
				} else {
					sendRegisterFirstMessage(message.chat.id);
				}
			})
			.catch(err => {
				console.log(`Unregistered listener tried to register for patient. Got ${err}`);
				sendRegisterFirstMessage(message.chat.id)
			});
	});
};


module.exports = {
	setupTelegram: setup
};