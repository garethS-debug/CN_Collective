const { Game, GameResult } = require("../models");

async function createResult(req, res) {
  const { gameKey, score, duration } = req.body;

  if (!gameKey || score === undefined || duration === undefined) {
    return res.status(400).json({
      message: "gameKey, score and duration are required",
    });
  }

  try {
    const game = await Game.findOne({
      where: { key: gameKey },
    });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const result = await GameResult.create({
      score,
      duration,
      userId: req.user.id,
      gameId: game.id,
    });

    const savedResult = await GameResult.findByPk(result.id, {
      include: [
        {
          model: Game,
          as: "game",
          attributes: ["id", "key", "title"],
        },
      ],
    });

    return res.status(201).json({
      message: "Result saved successfully",
      result: savedResult,
    });
  } catch (error) {
    console.error("Create result error:", error.message);
    return res.status(500).json({ message: "Failed to save result" });
  }
}

async function getMyResults(req, res) {
  try {
    const results = await GameResult.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Game,
          as: "game",
          attributes: ["id", "key", "title"],
        },
      ],
      order: [["playedAt", "DESC"]],
    });

    return res.json({ results });
  } catch (error) {
    console.error("Get my results error:", error.message);
    return res.status(500).json({ message: "Failed to get results" });
  }
}

async function getLeaderboard(req, res) {
  const { gameKey } = req.params;

  try {
    const game = await Game.findOne({
      where: { key: gameKey },
    });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const results = await GameResult.findAll({
      where: { gameId: game.id },
      include: [
        {
          association: "user",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["score", "DESC"],
        ["duration", "ASC"],
      ],
      limit: 10,
    });

    return res.json({
      game: {
        key: game.key,
        title: game.title,
      },
      results,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error.message);
    return res.status(500).json({ message: "Failed to get leaderboard" });
  }
}

module.exports = {
  createResult,
  getMyResults,
  getLeaderboard,
};
