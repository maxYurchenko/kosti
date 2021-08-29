const libLocation = "../../../site/lib/";

const gmLib = require("/lib/festival/gmLib");
const adminLib = require(libLocation + "adminLib");
const thymeleaf = require("/lib/thymeleaf");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return { success: false };
  }
  gmLib.deletePlayer(req.params.gameId, req.params.playerId);
  let players = gmLib.listPlayers(req.params.gameId);

  return {
    body: {
      html: thymeleaf.render(resolve("./../templates/playersListModal.html"), {
        players: players,
        gameId: req.params.gameId
      })
    },
    contentType: "application/json"
  };
};
