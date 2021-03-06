const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    author: {
        type: String,
        required: false,
    },
    saved: {
        type: Boolean,
        default: false,
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note",
    },
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;