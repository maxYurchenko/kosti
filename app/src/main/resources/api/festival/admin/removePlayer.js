const libLocation = "../../../site/lib/";

const gmLib = require("/lib/festival/gmLib");
const adminLib = require(libLocation + "adminLib");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return { success: false };
  }
  return {
    body: gmLib.deletePlayer(req.params.gameId, req.params.playerId),
    contentType: "application/json"
  };
};
