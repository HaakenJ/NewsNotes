const express = require('express');
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newsNotes";

mongoose.connect(MONGODB_URI);

require("./routes/api-routes")(app);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}.`);
})