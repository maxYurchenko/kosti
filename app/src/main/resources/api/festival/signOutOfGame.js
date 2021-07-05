const playerLib = require("/lib/festival/playerLib");

exports.post = function (req) {
  return {
    body: playerLib.signOutOfGame(req.params.gameId),
    contentType: "application/json"
  };
};
