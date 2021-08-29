const thymeleaf = require("/lib/thymeleaf");
const playerLib = require("/lib/festival/playerLib");
const userLib = require("/lib/userLib");

exports.get = function (req) {
  if (req.params && req.params["theme[]"]) {
    req.params.theme = req.params["theme[]"];
    delete req.params["theme[]"];
  }
  let games = playerLib.getGames({
    day: req.params.day,
    system: req.params.system,
    theme: req.params.theme,
    gameSpace: req.params.gameSpace,
    count: 9,
    start: req.params.page ? parseInt(req.params.page) * 9 : 0,
    parent: req.params.parent ? req.params.parent : undefined
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
