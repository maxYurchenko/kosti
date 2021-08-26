const playerLib = require("/lib/festival/playerLib");

exports.post = function (req) {
  return {
    body: playerLib.signForGame(req.params),
    contentType: "application/json"
  };
};
