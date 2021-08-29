const libLocation = "../../../site/lib/";

const playerLib = require("/lib/festival/playerLib");
const adminLib = require(libLocation + "adminLib");
const thymeleaf = require("/lib/thymeleaf");
const norseUtils = require(libLocation + "norseUtils");
const contentLib = require("/lib/xp/content");

exports.post = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return {
      success: false,
      message: "Вам нужно быть админом, чтоб выполнить это."
    };
  }
  return {
    body: {
      data: playerLib.signForGame(req.params, true),
      game: contentLib.get({ key: req.params.gameId })
    },
    contentType: "application/json"
  };
};

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return {
      success: false,
      message: "Вам нужно быть админом, чтоб выполнить это."
    };
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
