// Express for routing
const express = require("express");
const router = express.Router();

// User Model
const User = require("../../models/User");

// Classification
const notifyDataAdded = require("../../background/classifier").breathDataAdded;


// Pusher for realtime updates
const Pusher = require("pusher");
const pusher = new Pusher({
	appId: "769736",
	key: "bd94a2a2564938087657",
	secret: "ca2b3be8b063515f7913",
	cluster: "eu",
	useTLS: true
});

const channel = "user-channel";


// @route 	GET api/users
// @desc 	Get All Users
// @access 	Public
router.get("/", (req, res) => {
	User.find()
		.sort({name: 1})
		.then(users => {
			res.json(users)
		})
});

// @route 	POST api/users
// @desc 	Create a user
// @access 	Public
router.post("/", (req, res) => {
	const newUser = new User({
		name: req.body.name,
		breath: req.body.breath
	});

	newUser.save()
		.then(user => {
			res.json(user);
			pusher.trigger(channel, "user-added", user)
		})
		.catch(err => res.status(500).json({success: false, message: "Could not create new user", data: err}));
});

// @route 	POST api/users
// @desc 	Create a user
// @access 	Public
router.put("/:id", (req, res) => {
	const breath = req.body.breath;

	User.updateOne(
		{_id: req.params.id},
		{"$push": {"breath": breath}})
		.then(result => {
			res.status(201).json({success: true, message: "Breath value appended successfully", data: result});
			notifyDataAdded(req.params.id);
			pusher.trigger(channel, "breath-value-added", {
				id: req.params.id,
				breath: breath
			})
		})
		.catch(err => res.status(500).json({success: false, message: "Could not append value", data: err}));
});

// @route 	DELETE api/users
// @desc 	Delete a user
// @access 	Public
router.delete("/:id", (req, res) => {
	User.findById(req.params.id)
		.then(user => user.remove()
			.then(() => res.json({success: true}))
			.then(() => pusher.trigger(channel, "user-deleted", user._id)))
		.catch(err => res.status(404).json({success: false, data: err}));
});


module.exports = router;