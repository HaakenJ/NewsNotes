const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const db = require("../models");

app.get("/scrape", (req, res) => {
    // Grab html with axios.
    axios.get("https://www.thestranger.com/").then(response => {
        // Load html into cheerio and store.
        const $ = cheerio.load(response.data);

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

            result.author = headline
                .find("h4.byline")
                .text()
                .replace("by", "")
                .trim();

            // Create new Article using the `result` obj.
            db.Article.create(result)
                .then(dbArticle => {
                    console.log(dbArticle);
                })
                .catch(err => {
                    console.error(err);
                });
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
      })
  });
  