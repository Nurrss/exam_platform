const mongoose = require("mongoose");
const { Schema } = mongoose;

const NewsSchema = new Schema(
  {
    imgPath: {
      type: String,
      required: true,
    },
    newsTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, get: (time) => time.toDateString() }
);

module.exports = mongoose.model("News", NewsSchema);
