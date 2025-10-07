const router = require("express").Router();
const _ = require("lodash");

const News = require("../models/News");

// get all
router.get("/", async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
