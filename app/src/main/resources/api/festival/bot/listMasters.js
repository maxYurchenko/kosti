const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "../../../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const gmLib = require("/lib/festival/gmLib");
const festivalBotLib = require(libLocation + "games/bot");

exports.get = function (req) {
  const withGamesOnly = req.params.withGamesOnly;
  return {
    body: gmLib.listMasters(withGamesOnly),
    contentType: "application/json"
  };
};
