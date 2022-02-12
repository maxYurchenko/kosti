const thymeleaf = require("/lib/thymeleaf");
const playerLib = require("/lib/festival/playerLib");
const userLib = require("/lib/userLib");

const libLocation = "../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const festivalLib = require("/lib/festival/festivalLib");

exports.get = function (req) {
  if (req.params && req.params["theme[]"]) {
    req.params.theme = req.params["theme[]"];
    delete req.params["theme[]"];
  }
  const games = playerLib.getGames({
    day: req.params.day,
    system: req.params.system,
    theme: req.params.theme,
    gameSpace: req.params.gameSpace,
    count: 9,
    start: req.params.page ? parseInt(req.params.page) * 9 : 0,
    parent: req.params.parent ? req.params.parent : undefined
  });
  const festival = req.params.parent
    ? festivalLib.getFestivalByChild(req.params.parent)
    : null;
  return {
    body: {
      html: thymeleaf.render(
        resolve("../../site/pages/games/gamesBlock.html"),
        {
          games: games,
          user: userLib.getCurrentUser(),
          currentBlock: req.params.currentBlock
            ? req.params.currentBlock
            : null,
          currentDay: req.params.currentDay ? req.params.currentDay : null,
          cityBoss: festival
            ? userLib.checkCurrentUserCityBoss(festival.data.bossRole)
            : false
        }
      ),
      noMoreGames: games.length < 1,
      currentBlock:
        games.length > 0
          ? games[games.length - 1].processed.block.content._id
          : null,
      currentDay:
        games.length > 0
          ? games[games.length - 1].processed.day.content._id
          : null
    },
    contentType: "application/json"
  };
};
