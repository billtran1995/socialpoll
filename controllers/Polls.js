const boom = require("@hapi/boom");

const {
  convertStringToObjectId,
  checkIfUserExists,
  checkIfPollExists,
  checkIfChoiceExists
} = require("../utils");

const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const Like = require("../models/Like");
const Follow = require("../models/Follow");

const validateQuestion = question => {
  return (
    question.length > 0 &&
    question.length <= 1000 &&
    /^[a-zA-Z0-9,.?' ]+$/.test(question)
  );
};

const validateChoices = choices => {
  return (
    choices.every(choice => choice.choice !== "") &&
    choices.every(choice => /^[a-zA-Z0-9,.?' ]+$/.test(choice.choice)) &&
    choices.every(choice => choice.choice.length <= 90)
  );
};

// Create Poll
exports.createPoll = async (req, res, next) => {
  const { userId, question, choices } = req.body;
  const arrayChoices = JSON.parse(choices).map(choice => ({ choice }));

  try {
    if (!(await checkIfUserExists(userId))) {
      return next(boom.notFound("User does not exist"));
    }

    if (!validateQuestion(question) || !validateChoices(arrayChoices)) {
      return next(boom.notAcceptable("Unacceptable inputs"));
    }

    let newPoll = new Poll({
      question,
      choices: arrayChoices,
      author: convertStringToObjectId(userId)
    });

    newPoll = await newPoll.save();

    return res.status(200).json(newPoll);
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};

// Get Poll
exports.getPoll = async (req, res, next) => {
  const { pollId } = req.params;

  try {
    const poll = await Poll.findById(pollId)
      .populate({
        path: "author",
        select: "nickName"
      })
      .populate({
        path: "comments",
        select: "-__v -updatedAt",
        populate: {
          path: "author",
          select: "nickName picture"
        }
      })
      .exec();

    if (!poll) {
      return next(boom.notFound("Poll not found"));
    }

    return res.status(200).json(poll);
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};

// Vote Poll
exports.votePoll = async (req, res, next) => {
  const { pollId, userId, choice } = req.body;

  try {
    if (!(await checkIfUserExists(userId))) {
      return next(boom.notFound("User does not exist"));
    }

    if (!(await checkIfPollExists(pollId))) {
      return next(boom.notFound("Poll does not exist"));
    }

    if (!(await checkIfChoiceExists(pollId, choice))) {
      return next(boom.notFound("Choice does not exist"));
    }

    const voted = await Vote.findOne({
      pollId: convertStringToObjectId(pollId),
      userId: convertStringToObjectId(userId)
    });

    if (voted) {
      return next(boom.badRequest("Can't vote twice."));
    }

    await Poll.updateVotes(pollId, choice);

    const newVote = new Vote({
      userId: convertStringToObjectId(userId),
      pollId: convertStringToObjectId(pollId),
      votedChoice: choice
    });

    await newVote.save();

    return res.status(200).json(newVote);
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};

// Like Poll
exports.likePoll = async (req, res, next) => {
  const { userId } = req.body;
  const { pollId } = req.params;

  try {
    if (!(await checkIfUserExists(userId))) {
      return next(boom.notFound("User does not exist"));
    }

    if (!(await checkIfPollExists(pollId))) {
      return next(boom.notFound("Poll does not exist"));
    }

    const liked = await Like.findOne({
      pollId: convertStringToObjectId(pollId),
      userId: convertStringToObjectId(userId)
    });

    if (liked) {
      return next(boom.badRequest("Can't like the same poll twice"));
    }

    await Poll.like(pollId);

    const newLike = new Like({
      userId: convertStringToObjectId(userId),
      pollId: convertStringToObjectId(pollId)
    });

    await newLike.save();

    return res.status(200).json(newLike);
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};

// Unlike Poll
exports.unlikePoll = async (req, res, next) => {
  const { userId } = req.body;
  const { pollId } = req.params;

  try {
    if (!(await checkIfUserExists(userId))) {
      return next(boom.notFound("User does not exist"));
    }

    if (!(await checkIfPollExists(pollId))) {
      return next(boom.notFound("Poll does not exist"));
    }

    const liked = await Like.findOne({
      pollId: convertStringToObjectId(pollId),
      userId: convertStringToObjectId(userId)
    });

    if (!liked) {
      return next(boom.badRequest("Poll is already unliked"));
    }

    await Poll.unlike(pollId);

    await Like.deleteOne({
      pollId: convertStringToObjectId(pollId),
      userId: convertStringToObjectId(userId)
    });

    return res.status(200).json({ message: "Successfully unlike" });
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};

// Follow Poll
exports.followPoll = async (req, res, next) => {
  const { userId } = req.body;
  const { pollId } = req.params;

  try {
    if (!(await checkIfUserExists(userId))) {
      return next(boom.notFound("User does not exist"));
    }

    if (!(await checkIfPollExists(pollId))) {
      return next(boom.notFound("Poll does not exist"));
    } else {
      let poll = await Poll.findById(pollId);

      if (poll.author.toHexString() === userId) {
        return next(boom.badRequest("Cannot follow own poll"));
      }
    }

    const followed = await Follow.findOne({
      pollId: convertStringToObjectId(pollId),
      userId: convertStringToObjectId(userId)
    });

    if (followed) {
      return next(boom.badRequest("Can't follow the same poll twice"));
    }

    await Poll.follow(pollId);

    const newFollow = new Follow({
      pollId: convertStringToObjectId(pollId),
      userId: convertStringToObjectId(userId)
    });
    await newFollow.save();

    return res.status(200).json(newFollow);
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};

// Unfollow Poll
exports.unfollowPoll = async (req, res, next) => {
  const { userId } = req.body;
  const { pollId } = req.params;

  try {
    if (!(await checkIfUserExists(userId))) {
      return next(boom.notFound("User does not exist"));
    }

    if (!(await checkIfPollExists(pollId))) {
      return next(boom.notFound("Poll does not exist"));
    }

    const followed = await Follow.findOne({
      pollId: convertStringToObjectId(pollId),
      userId: convertStringToObjectId(userId)
    });

    if (!followed) {
      return next(boom.badRequest("Can't unfollow the same poll twice"));
    }

    await Poll.unfollow(pollId);

    await Follow.deleteOne({
      pollId: convertStringToObjectId(pollId),
      userId: convertStringToObjectId(userId)
    });

    return res.status(200).json({ message: "Successfully unfollow poll" });
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};

// Get Polls
exports.getPolls = async (req, res, next) => {
  const FilterOptions = {
    Default: "default",
    Following: "following",
    Own: "own",
    Voted: "voted"
  };

  let { skip, limit, filter, userId } = req.query;
  let polls;
  let hasMore;

  skip ? (skip = +skip) : (skip = 0);
  limit ? (limit = +limit) : (limit = 0);

  try {
    if (!filter || !/default|following|own|voted/.test(filter)) {
      filter = FilterOptions.Default;
    }

    if (filter === FilterOptions.Default) {
      polls = await Poll.find()
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .populate({ path: "author", select: "nickName picture" });

      hasMore =
        skip + limit !== 0 &&
        (await Poll.find()
          .skip(skip + limit)
          .countDocuments()) > 0;
    } else {
      const { userId } = req.query;

      if (!userId) {
        return next(
          boom.badRequest("User id is required for non-default get polls")
        );
      }

      if (filter === FilterOptions.Following) {
        let follows = await Follow.find({
          userId: convertStringToObjectId(userId)
        })
          .sort("-createdAt")
          .skip(skip)
          .limit(limit);

        if (!follows) {
          return next(boom.badRequest("No followings are found"));
        }

        hasMore =
          skip + limit !== 0 &&
          (await Follow.find({
            userId: convertStringToObjectId(userId)
          })
            .skip(skip + limit)
            .countDocuments()) > 0;

        follows = follows.map(follow => convertStringToObjectId(follow.pollId));

        polls = await Poll.find({ _id: { $in: follows } }).populate({
          path: "author",
          select: "nickName picture"
        });
      }

      if (filter === FilterOptions.Own) {
        polls = await Poll.find({ author: convertStringToObjectId(userId) })
          .sort("-createdAt")
          .skip(skip)
          .limit(limit)
          .populate({ path: "author", select: "nickName picture" });

        hasMore =
          skip + limit !== 0 &&
          (await Poll.find({ author: convertStringToObjectId(userId) })
            .skip(skip + limit)
            .countDocuments()) > 0;
      }

      if (filter === FilterOptions.Voted) {
        let votedPolls = await Vote.find({
          userId: convertStringToObjectId(userId)
        })
          .sort("-createdAt")
          .skip(skip)
          .limit(limit);

        if (!votedPolls) {
          return next(boom.badRequest("No voted polls are found"));
        }

        hasMore =
          skip + limit !== 0 &&
          (await Vote.find({
            userId: convertStringToObjectId(userId)
          })
            .skip(skip + limit)
            .countDocuments()) > 0;

        votedPolls = votedPolls.map(votedPoll =>
          convertStringToObjectId(votedPoll.pollId)
        );

        polls = await Poll.find({ _id: { $in: votedPolls } }).populate({
          path: "author",
          select: "nickName picture"
        });
      }
    }

    let records = [];

    await Promise.all(
      polls.map(async poll => {
        let result = { pollId: poll._id };

        let voted = await Vote.findOne({
          pollId: poll._id,
          userId: convertStringToObjectId(userId)
        });
        let liked = await Like.findOne({
          pollId: poll._id,
          userId: convertStringToObjectId(userId)
        });
        let followed = await Follow.findOne({
          pollId: poll._id,
          userId: convertStringToObjectId(userId)
        });

        if (voted) {
          result.isVoted = true;
          result.votedChoice = voted.votedChoice;
        }

        liked && (result.isLiked = true);
        followed && (result.isFollowed = true);

        records.push(result);
      })
    );

    return res
      .status(200)
      .json({ hasMore, polls, records, count: polls.length });
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};

exports.getStatistic = async (req, res, next) => {
  const { pollId } = req.params;
  const { month, year } = req.query;

  try {
    if (!(await checkIfPollExists(pollId))) {
      return next(boom.notFound("Poll does not exist"));
    }

    let poll = await Poll.findById(pollId);
    let stat = {};

    stat.totalVotes = poll.totalVotes;
    stat.totalLikes = poll.totalLikes;
    stat.totalFollowings = poll.totalFollowings;
    // stat.month = month;
    // stat.year = year;

    let monthlyVoteStats = await Vote.getVoteStats(month, year, pollId);

    // let monthlyLikeStats = await Like.getLikeStats(month, year, pollId);

    // let monthlyFollowStats = await Follow.getFollowStats(month, year, pollId);

    stat.monthlyVoteStats = monthlyVoteStats;
    // stat.monthlyLikeStats = monthlyLikeStats;
    // stat.monthlyFollowStats = monthlyFollowStats;
    res.status(200).json(stat);
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};
