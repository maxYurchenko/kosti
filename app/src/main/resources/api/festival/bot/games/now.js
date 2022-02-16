const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const festivalBotLib = require("/lib/festival/bot");

exports.get = function (req) {
  return {
    body: festivalBotLib.getGames(),
    contentType: "application/json"
  };
};
