const router = require("express").Router();
const _ = require("lodash");

const News = require("../models/News");
const Text = require("../models/Text");
const errorHandler = require("../middleware/errorHandler");

// get all done
router.route("/news").get(async (req, res) => {
  try {
    const newsItems = await News.find();
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).json(newsItems);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

// add news
router.post("/news/add", async (req, res) => {
  try {
    console.log(req);
    const { imgPath, newsTitle, description } = req.body;
    const newNews = new News({
      imgPath,
      newsTitle,
      description,
    });
    await newNews.save();
    res.status(200).json(newNews);
  } catch (error) {
    console.log(error);
  }
});

// get by id
router.get("/news/:id", async (req, res) => {
  try {
    const NewsId = _.get(req, "params.id");
    if (!NewsId) {
      res.status(400).json({ message: "Id not found", success: false });
    } else {
      const news = await News.findById(NewsId);
      res.status(200).json(news);
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/news/:id", async (req, res) => {
  try {
    const newsId = _.get(req, "params.id");
    const { imgPath, newsTitle, description } = req.body;
    const updatedNews = await News.findByIdAndUpdate(newsId, {
      imgPath,
      newsTitle,
      description,
    });
    const updated = await updatedNews.save();
    console.log(updated);
    res.status(200).json(updatedNews);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/news/:id", async (req, res) => {
  try {
    const newsId = _.get(req, "params.id");
    if (!newsId) {
      return res.status(400).json({ message: ` ID required.` });
    } else {
      await News.findByIdAndDelete(newsId).then(
        res.status(200).json(`${newsId} : was deleted`)
      );
    }
  } catch (err) {
    console.log(err);
  }
});

router.route("/text").get(async (req, res) => {
  try {
    const textItems = await Text.find();
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).json(textItems);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

router.post("/text/add", async (req, res) => {
  try {
    console.log(req);
    const { kz_text, rus_text } = req.body;
    const newText = new Text({
      kz_text,
      rus_text,
    });
    await newText.save();
    res.status(200).json(newText);
  } catch (error) {
    console.log(error);
  }
});

// get by id
router.get("/text/:id", async (req, res) => {
  try {
    const TextId = _.get(req, "params.id");
    if (!TextId) {
      res.status(400).json({ message: "Id not found", success: false });
    } else {
      const text = await Text.findById(TextId);
      res.status(200).json(text);
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/text/:id", async (req, res) => {
  try {
    const textId = _.get(req, "params.id");
    const { kz_text, rus_text } = req.body;
    const updatedText = await Text.findByIdAndUpdate(textId, {
      kz_text,
      rus_text,
    });
    const updated = await updatedText.save();
    console.log(updated);
    res.status(200).json(updatedText);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/text/:id", async (req, res) => {
  try {
    const textId = _.get(req, "params.id");
    if (!textId) {
      return res.status(400).json({ message: ` ID required.` });
    } else {
      await Text.findByIdAndDelete(textId).then(
        res.status(200).json(`${textId} : was deleted`)
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
