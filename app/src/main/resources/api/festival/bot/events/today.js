const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const userLib = require("/lib/userLib");
const formPlayerLib = require(libLocation + "games/formPlayerLib");
const festivalBotLib = require(libLocation + "games/bot");

exports.get = function (req) {
  return {
    body: festivalBotLib.getEvents("today"),
    contentType: "application/json"
  };
};
