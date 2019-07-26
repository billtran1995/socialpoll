const boom = require("@hapi/boom");

const User = require("../models/User");

const validateNickName = name => {
  return name !== "";
};

exports.getUser = async (req, res, next) => {
  const { id, nickName, picture } = req.body;

  try {
    let user = await User.findOne({ id });

    if (!user) {
      if (!nickName || !validateNickName(nickName)) {
        return next(boom.badRequest("User name is required"));
      }

      user = new User({
        id,
        nickName,
        picture: picture ? picture : ""
      });

      await user.save();
    }

    res.status(200).json({
      user
    });
  } catch (err) {
    console.error(err);
    return next(boom.badImplementation("Internal server error occurred"));
  }
};
