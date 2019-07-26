const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  nickName: String,
  picture: String
});

module.exports = mongoose.model("User", userSchema);
