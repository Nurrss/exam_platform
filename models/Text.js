const mongoose = require("mongoose");
const { Schema } = mongoose;

const TextSchema = new Schema({
  kz_text: {
    type: String,
    required: true,
  },
  rus_text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Text", TextSchema);
