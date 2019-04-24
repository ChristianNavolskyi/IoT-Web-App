const express = require("express");
const router = express.Router();

// User Model
const User = require("../../models/User");

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
// @desc 	Create a post
// @access 	Public
router.post("/", (req, res) => {
	const newUser = new User({
		name: req.body.name,
	});

	newUser.save()
		.then(user => res.json(user))
		.catch(err => console.log(`Failed to add new user with body ${req.body} and error ${err}`));
});

// @route 	DELETE api/users
// @desc 	Delete a user
// @access 	Public
router.delete('/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => user.remove().then(() => res.json({success: true})))
		.catch(err => res.status(404).json({success: false}));
});


module.exports = router;