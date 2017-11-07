const mongoose = require("mongoose");
const schema =mongoose.Schema;

let urlSchema = new schema({
  originalUrl: String,
  shorterUrl: String
}, {timestamps: true});

const modelClass = mongoose.model("shortUrl", urlSchema);

module.exports = modelClass;
