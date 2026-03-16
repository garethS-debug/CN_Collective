const express = require("express");
const {
  createResult,
  getMyResults,
  getLeaderboard,
} = require("../controllers/results.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createResult);
router.get("/me", authMiddleware, getMyResults);
router.get("/leaderboard/:gameKey", getLeaderboard);

module.exports = router;
