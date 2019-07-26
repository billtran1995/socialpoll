const router = require("express").Router();
const { getUser } = require("../controllers/User");

router.post("/", getUser);

module.exports = router;
