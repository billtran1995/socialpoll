const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", likeSchema);
