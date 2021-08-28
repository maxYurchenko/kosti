const libLocation = "../../../site/lib/";

const gmLib = require("/lib/festival/gmLib");
const adminLib = require(libLocation + "adminLib");
const thymeleaf = require("/lib/thymeleaf");
const norseUtils = require(libLocation + "norseUtils");

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
    body: {
      html: thymeleaf.render(resolve("./../templates/playersListModal.html"), {
        players: players,
        gameId: req.params.gameId
      })
    },
    contentType: "application/json"
  };
};
