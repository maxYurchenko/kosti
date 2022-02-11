const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "../../../../site/lib/";
const contextLib = require(libLocation + "contextLib");
const norseUtils = require(libLocation + "norseUtils");
const gmLib = require("/lib/festival/gmLib");

exports.get = function (req) {
  const withGamesOnly = req.params.withGamesOnly;
  const masters = contextLib.runAsAdmin(function () {
    return gmLib.listMasters(withGamesOnly);
  });
  return {
    body: masters,
    contentType: "application/json"
  };
};
