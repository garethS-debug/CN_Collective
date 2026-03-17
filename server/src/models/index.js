const sequelize = require("../config/database");
const User = require("./User");
const Game = require("./Game");
const GameResult = require("./GameResult");

User.hasMany(GameResult, {
  foreignKey: "userId",
  as: "results",
});

GameResult.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Game.hasMany(GameResult, {
  foreignKey: "gameId",
  as: "results",
});

GameResult.belongsTo(Game, {
  foreignKey: "gameId",
  as: "game",
});

const defaultGames = [
  {
    key: "memory_cards",
    title: "Memory Cards",
    description: "Match pairs of cards to train memory.",
  },
  {
    key: "find_the_number",
    title: "Find the Number",
    description: "Tap numbers in the correct order to build focus.",
  },
  {
    key: "sequence_repeat",
    title: "Sequence Repeat",
    description: "Repeat the shown pattern to practice short-term memory.",
  },
  {
    key: "reaction_tap",
    title: "Reaction Tap",
    description: "Tap as quickly as you can when the signal appears.",
  },
    {
    key: "breakout",
    title: "Breakout",
    description: "Break bricks and score points.",
  },
];

async function connectDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
  await Game.bulkCreate(defaultGames, {
    ignoreDuplicates: true,
  });
}

module.exports = {
  sequelize,
  User,
  Game,
  GameResult,
  connectDatabase,
};
