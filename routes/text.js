const router = require("express").Router();
const _ = require("lodash");

const Text = require("../models/Text");
const errorHandler = require("../middleware/errorHandler");

// get by id
router.get("/:id", async (req, res) => {
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

router.get("/", async (req, res) => {
  try {
    const text = await Text.find();
    res.status(200).json(text);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
