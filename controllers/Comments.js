const boom = require("@hapi/boom");

const Comment = require("../models/Comment");

const {
  convertStringToObjectId,
  checkIfUserExists,
  checkIfPollExists
} = require("../utils");

const validateComment = comment => {
  return comment.length > 0 && comment.length <= 200;
};

// Create comment
exports.createComment = async (req, res, next) => {
  const { userId, body } = req.body;
  const { pollId } = req.params;

  try {
    if (!(await checkIfUserExists(userId))) {
      return next(boom.notFound("User does not exist"));
    }

    if (!(await checkIfPollExists(pollId))) {
      return next(boom.notFound("Poll does not exist"));
    }

    if (!validateComment(body)) {
      return next(boom.notAcceptable("Unacceptable input"));
    }

    const newComment = await Comment.createComment(
      convertStringToObjectId(pollId),
      convertStringToObjectId(userId),
      body
    );

    return res.status(200).json(newComment);
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};
