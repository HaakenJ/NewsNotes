const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

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
        })
    })
})