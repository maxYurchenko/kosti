const libLocation = "../../../site/lib/";

const gmLib = require("/lib/festival/gmLib");
const adminLib = require(libLocation + "adminLib");
const thymeleaf = require("/lib/thymeleaf");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return { success: false };
  }
  let players = gmLib.listPlayers(req.params.gameId);
  if (req.params.format === "json") {
    return {
      body: players,
      contentType: "application/json"
    };
  }
  return {
    body: thymeleaf.render(resolve("./../templates/playersList.html"), {
      players: players
    }),
    contentType: "text/html"
  };
};
