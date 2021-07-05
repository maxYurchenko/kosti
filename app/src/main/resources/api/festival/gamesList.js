const thymeleaf = require("/lib/thymeleaf");
const playerLib = require("/lib/festival/playerLib");

exports.get = function (req) {
  if (req.params && req.params["theme[]"]) {
    req.params.theme = req.params["theme[]"];
    delete req.params["theme[]"];
  }
  return {
    body: {
      html: thymeleaf.render(
        resolve("../../site/pages/games/gamesBlock.html"),
        {
          games: playerLib.getGames({
            day: req.params.dayId,
            system: req.params.system,
            theme: req.params.theme,
            gameSpace: req.params.gameSpace
          })
        }
      )
    },
    contentType: "application/json"
  };
};
