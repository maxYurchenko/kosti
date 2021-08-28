const thymeleaf = require("/lib/thymeleaf");
const playerLib = require("/lib/festival/playerLib");
const userLib = require("/lib/userLib");

exports.get = function (req) {
  if (req.params && req.params["theme[]"]) {
    req.params.theme = req.params["theme[]"];
    delete req.params["theme[]"];
  }
  let games = playerLib.getGames({
    day: req.params.dayId,
    system: req.params.system,
    theme: req.params.theme,
    gameSpace: req.params.gameSpace,
    count: 9,
    start: req.params.page ? parseInt(req.params.page) * 9 : 0
  });
  return {
    body: {
      html: thymeleaf.render(
        resolve("../../site/pages/games/gamesBlock.html"),
        {
          games: games,
          user: userLib.getCurrentUser()
        }
      ),
      noMoreGames: games.length < 1
    },
    contentType: "application/json"
  };
};
