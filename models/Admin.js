const { Schema, model } = require("mongoose");

const AdminsSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = model("Admins", AdminsSchema);
