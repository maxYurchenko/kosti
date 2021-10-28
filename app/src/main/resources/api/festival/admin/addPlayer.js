const libLocation = "../../../site/lib/";

const norseUtils = require(libLocation + "norseUtils");

const playerLib = require("/lib/festival/playerLib");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");
const festivalLib = require("/lib/festival/festivalLib");
const userLib = require("/lib/userLib");

exports.post = function (req) {
  let game = contentLib.get({ key: req.params.gameId });
  let festival = festivalLib.getFestivalByChild(game._id);
  if (!userLib.checkCurrentUserCityBoss(festival.data.bossRole)) {
    return { success: false };
  }
  let returnData = playerLib.signForGame(req.params, true);
  returnData.game = contentLib.get({ key: req.params.gameId });
  return {
    body: returnData,
    contentType: "application/json"
  };
};

exports.get = function (req) {
  let game = contentLib.get({ key: req.params.gameId });
  let festival = festivalLib.getFestivalByChild(game._id);
  if (!userLib.checkCurrentUserCityBoss(festival.data.bossRole)) {
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
