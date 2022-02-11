const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "../../../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const festivalBotLib = require("/lib/festival/bot");

exports.post = function (req) {
  return {
    body: null,
    //body: festivalBotLib.checkUser(JSON.parse(req.body)),
    contentType: "application/json"
  };
};
