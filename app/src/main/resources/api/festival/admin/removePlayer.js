const libLocation = "../../../site/lib/";

const norseUtils = require(libLocation + "norseUtils");

const gmLib = require("/lib/festival/gmLib");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");
const festivalLib = require("/lib/festival/festivalLib");
const userLib = require("/lib/userLib");

exports.get = function (req) {
  let game = contentLib.get({ key: req.params.gameId });
  let festival = festivalLib.getFestivalByChild(game._id);
  if (!userLib.checkCurrentUserCityBoss(festival.data.bossRole)) {
    return { success: false };
  }
  gmLib.deletePlayer(req.params.gameId, req.params.playerId);
  let players = gmLib.listPlayers(req.params.gameId).data;
  game = contentLib.get({ key: req.params.gameId });

  return {
    body: {
      html: thymeleaf.render(resolve("./../templates/playersListModal.html"), {
        players: players,
        gameId: req.params.gameId
      }),
      game: game
    },
    contentType: "application/json"
  };
};
