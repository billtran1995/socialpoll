const { ObjectId } = require("mongoose").Types;
const User = require("../models/User");
const Poll = require("../models/Poll");

exports.convertStringToObjectId = value => {
  return ObjectId(value);
};

exports.checkIfUserExists = async userId => {
  const user = await User.findById(userId);

  if (!user) {
    return false;
  }

  return true;
};

exports.checkIfPollExists = async pollId => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    return false;
  }

  return true;
};

exports.checkIfChoiceExists = async (pollId, p_choice) => {
  const poll = await Poll.findById(pollId);

  if (!poll.choices.some(choice => choice.choice === p_choice)) {
    return false;
  }

  return true;
};
