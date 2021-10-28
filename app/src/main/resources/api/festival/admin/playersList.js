const libLocation = "../../../site/lib/";

const norseUtils = require(libLocation + "norseUtils");

const gmLib = require("/lib/festival/gmLib");
const thymeleaf = require("/lib/thymeleaf");
const festivalLib = require("/lib/festival/festivalLib");
const contentLib = require("/lib/xp/content");
const userLib = require("/lib/userLib");

exports.get = function (req) {
  let game = contentLib.get({ key: req.params.gameId });
  let festival = festivalLib.getFestivalByChild(game._id);
  if (!userLib.checkCurrentUserCityBoss(festival.data.bossRole)) {
    return { success: false };
  }
  let players = gmLib.listPlayers(req.params.gameId);
  if (req.params.format === "json") {
    return {
      body: players,
      contentType: "application/json"
    };
  }
  return {
    body: {
      html: thymeleaf.render(resolve("./../templates/playersListModal.html"), {
        players: players,
        gameId: req.params.gameId
      })
    },
    contentType: "application/json"
  };
};
