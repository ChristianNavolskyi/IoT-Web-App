const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const users = require("./routes/api/user");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;
mongoose.connect(db, {useNewUrlParser: true})
	.then(() => console.log("MongoDB connected."))
	.catch((err) => console.log(err));

// Routes
app.use("/api/user", users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
