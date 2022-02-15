const libLocation = "../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const playerLib = require("/lib/festival/playerLib");

exports.post = function (req) {
  return {
    body: playerLib.saveGameRedirect(req.params.gameId, req.cookies.cartId),
    contentType: "application/json"
  };
};
