const libLocation = "../../../site/lib/";

const gmLib = require("/lib/festival/gmLib");
const adminLib = require(libLocation + "adminLib");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return { success: false };
  }
  gmLib.deletePlayer(req.params.gameId, req.params.playerId);
  let players = gmLib.listPlayers(req.params.gameId);
  let game = contentLib.get({ key: req.params.gameId });

  return {
    body: {
      html: thymeleaf.render(resolve("./../templates/playersListModal.html"), {
        players: players,
        gameId: req.params.gameId
      }),
      game: game
    },
    contentType: "application/json"
  };
};
