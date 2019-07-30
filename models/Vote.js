const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongoose").Types;

const voteSchema = new Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    votedChoice: {
      type: String
    }
  },
  { timestamps: true }
);

class VoteClass {
  static async getVoteStats(month, year, pollId) {
    const monthStats = await this.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            pollId: "$pollId",
            votedChoice: "$votedChoice"
          },
          numberOfVotes: { $sum: 1 }
        }
      },
      {
        $match: {
          "_id.year": +year,
          "_id.pollId": ObjectId(pollId)
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          votedChoice: "$_id.votedChoice",
          numberOfVotes: 1
        }
      }
    ]);

    return monthStats;
  }
}

voteSchema.loadClass(VoteClass);

module.exports = mongoose.model("Vote", voteSchema);
