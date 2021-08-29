const libLocation = "../../../site/lib/";

const playerLib = require("/lib/festival/playerLib");
const adminLib = require(libLocation + "adminLib");
const thymeleaf = require("/lib/thymeleaf");
const norseUtils = require(libLocation + "norseUtils");

exports.post = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return { success: false };
  }
  return {
    body: playerLib.signForGame(req.params, true),
    contentType: "application/json"
  };
};

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return { success: false };
  }
  return {
    body: {
      html: thymeleaf.render(resolve("./../templates/addPlayerModal.html"), {
        gameId: req.params.gameId
      })
    },
    contentType: "application/json"
  };
};
