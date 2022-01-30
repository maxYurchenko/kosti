const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const httpClientLib = require("/lib/http-client");

const libLocation = "../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const userLib = require("/lib/userLib");
const helpers = require(libLocation + "helpers");
const cartLib = require("/lib/cartLib");
const formPlayerLib = require(libLocation + "games/formPlayerLib");

exports.get = function (req) {
  userLib.discordRegister(req.params.code, "api/festival/discord");
  const user = userLib.getCurrentUser();
  const cart = cartLib.getCart(req.cookies.cartId);
  let redirectUrl = null;
  if (cart.gameId) {
    if (formPlayerLib.updateUser(cart.ticketId, cart.firstName)) {
      const game = contentLib.get({ key: cart.gameId });
      game.data.players = norseUtils.forceArray(game.data.players);
      if (game.data.players.indexOf(cart._id) !== -1) {
        game.data.players[game.data.players.indexOf(cart._id)] =
          user.content._id;
      }
      formPlayerLib.updateEntity(game);
      redirectUrl = portal.pageUrl({ id: game._id });
    }
  }
  return {
    status: 302,
    headers: {
      Location: redirectUrl
    }
  };
};
