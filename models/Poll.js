const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongoose").Types;

const pollSchema = new Schema(
  {
    question: {
      type: String,
      trim: true
    },
    choices: [
      {
        choice: {
          type: String,
          trim: true
        },
        votes: {
          type: Number,
          default: 0
        }
      }
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    totalVotes: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    totalFollowings: {
      type: Number,
      default: 0
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

class PollClass {
  static async updateVotes(pollId, userChoice) {
    const poll = await this.findOne({ _id: ObjectId(pollId) });

    poll.choices = poll.choices.map(choice => {
      if (choice.choice === userChoice) {
        choice.votes++;
      }

      return choice;
    });

    poll.totalVotes += 1;
    await poll.save();
  }

  static async like(pollId) {
    const poll = await this.findOne({ _id: ObjectId(pollId) });

    poll.totalLikes += 1;
    await poll.save();
  }

  static async unlike(pollId) {
    const poll = await this.findOne({ _id: ObjectId(pollId) });

    poll.totalLikes -= 1;
    await poll.save();
  }

  static async follow(pollId) {
    const poll = await this.findOne({ _id: ObjectId(pollId) });

    poll.totalFollowings += 1;
    await poll.save();
  }

  static async unfollow(pollId) {
    const poll = await this.findOne({ _id: ObjectId(pollId) });

    poll.totalFollowings -= 1;
    await poll.save();
  }
}

pollSchema.loadClass(PollClass);

module.exports = mongoose.model("Poll", pollSchema);
