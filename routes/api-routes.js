const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const db = require("../models");


module.exports = app => {

    app.get("/scrape", (req, res) => {
        // Grab html with axios.
        axios.get("https://www.thestranger.com/").then(response => {
            // Load html into cheerio and store.
            const $ = cheerio.load(response.data);

            console.log(response.data);

            $("div.article").each(function (i, elem) {
                let result = {};

                const headline = $(this)
                    .find("h2.headline")
                    .children("a");

                // Add title, summary (if exists), url, and author to result obj.
                result.title = headline
                    .text()
                    .trim();

                result.summary = $(this)
                    .find("h3.subheadline") ?
                    $(this).find("h3.subheadline").text().trim() : null;

                result.url = headline
                    .attr("href");

                result.img = $(this)
                    .find("img")
                    .attr("src");

                result.author = $(this)
                    .find("h4.byline")
                    .text()
                    .replace("by", "")
                    .trim();

                // Check if the article is already in the database.
                // If it is not, an error will be returned and we will add
                // the article to the db.
                db.Article.find({
                    title: result.title
                }, (err, docs) => {
                    if (docs.length) {
                        console.log("Article already exists in db.");
                    } else {
                        console.log("Article does not exist.");
                        // Create new Article using the `result` obj.
                        db.Article.create(result)
                            .then(dbArticle => {
                                console.log(dbArticle);
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                })
            });
            res.send("Scrape Complete");
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        db.Article.find({})
            .populate("note")
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id.
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            })
            .populate("note")
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", (req, res) => {
        db.Note.create(req.body)
            .then(dbNote => {
                return db.Article.findOneAndUpdate({
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }, {
                        $set: {
                            note: dbNote._id
                        }
                    }, {
                        new: true
                    })
                    .then(dbArticle => {
                        res.json(dbArticle);
                    })
                    .catch(err => {
                        res.json(err);
                    });
            });
    });
};