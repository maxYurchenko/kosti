const libLocation = "../../../site/lib/";

const playerLib = require("/lib/festival/gmLib");
const adminLib = require(libLocation + "adminLib");

exports.post = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return { success: false };
  }
  return {
    body: playerLib.signForGame(req.params, true),
    contentType: "application/json"
  };
};
