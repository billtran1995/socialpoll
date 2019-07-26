const router = require("express").Router();
const {
  createPoll,
  getPoll,
  getPolls,
  votePoll,
  likePoll,
  unlikePoll,
  followPoll,
  unfollowPoll,
  getStatistic
} = require("../controllers/Polls");
const { createComment } = require("../controllers/Comments");

router.get("/", getPolls);
router.get("/:pollId", getPoll);
router.post("/createPoll", createPoll);
router.post("/vote", votePoll);
router.post("/:pollId/like", likePoll);
router.post("/:pollId/unlike", unlikePoll);
router.post("/:pollId/follow", followPoll);
router.post("/:pollId/unfollow", unfollowPoll);
router.post("/:pollId/comment", createComment);
router.get("/:pollId/getStat", getStatistic);

module.exports = router;
