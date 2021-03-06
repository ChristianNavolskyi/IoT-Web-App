const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const users = require("./routes/api/user");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

// DB config
let db;
if (process.env.MONGO_BACKEND === "local") {
	db = require("./config/keys").localURI
} else {
	db = require("./config/keys").herokuURI;
}

mongoose.connect(db, {useNewUrlParser: true})
	.then(() => console.info("MongoDB connected."))
	.catch((err) => console.warn(err));

// Routes
app.use("/api/user", users);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}


const port = process.env.PORT || 5000;
app.listen(port, () => console.info(`Server started on port ${port}`));
