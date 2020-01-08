const express = require('express');
const logger = require("morgan");
const mongoose = require("mongoose");

const db = require("./models");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



