const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongoose").Types;

const followSchema = new Schema(
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

class FollowClass {
  static async getFollowStats(month, year, pollId) {
    const monthStats = await this.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            pollId: "$pollId"
          },
          numberOfFollows: { $sum: 1 }
        }
      },
      {
        $match: {
          "_id.month": +month,
          "_id.year": +year,
          "_id.pollId": ObjectId(pollId)
        }
      },
      {
        $project: {
          _id: 0,
          numberOfFollows: 1
        }
      }
    ]);

    return monthStats;
  }
}

followSchema.loadClass(FollowClass);

module.exports = mongoose.model("Follow", followSchema);
