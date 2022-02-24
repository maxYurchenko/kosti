const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const festivalBotLib = require("/lib/festival/botLib");

exports.get = function (req) {
  return {
    body: festivalBotLib.getGames("user", req.params.userId),
    contentType: "application/json"
  };
};
