const mongoose = require("mongoose");
const keys = require("../keys");

const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
};

module.exports = async () => {
  try {
    await mongoose.connect(keys.mongoURI, options);
    console.log("Connected to database");

    require("../models/User");
    require("../models/Poll");
    require("../models/Like");
    require("../models/Vote");
    require("../models/Follow");
    require("../models/Comment");

    return mongoose.connection;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
