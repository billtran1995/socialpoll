const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Poll = require("./Poll");

const commentSchema = new Schema(
  {
    body: {
      type: String,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

class CommentClass {
  static async createComment(pollId, userId, body) {
    let newComment = await this.create({
      body,
      author: userId
    });

    let poll = await Poll.findById(pollId);

    poll.comments.push(newComment);
    await poll.save();

    newComment = await this.findById(newComment._id).populate({
      path: "author",
      select: "nickName picture"
    });

    return newComment;
  }
}

commentSchema.loadClass(CommentClass);

module.exports = mongoose.model("Comment", commentSchema);
