const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const httpClientLib = require("/lib/http-client");

const libLocation = "../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const userLib = require("/lib/userLib");
const helpers = require(libLocation + "helpers");
const formPlayerLib = require("/lib/festival/playerLib");

exports.post = function (req) {
  return {
    /*body: formPlayerLib.checkTicket({
      ticket: req.params.ticket,
      cartId: req.cookies.cartId
    }),*/
    body: formPlayerLib.bookSpace(
      req.params.gameId,
      req.params.ticket,
      req.params.firstName,
      req.cookies.cartId
    ),
    contentType: "application/json"
  };
};
