const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const httpClientLib = require("/lib/http-client");

const libLocation = "../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const userLib = require("/lib/userLib");
const helpers = require(libLocation + "helpers");
const cartLib = require("/lib/cartLib");
const formPlayerLib = require("/lib/festival/playerLib");

exports.post = function (req) {
  const ticketData = formPlayerLib.checkTicket(
    parseInt(req.params.ticketId),
    req.params.gameId
  );
  return {
    body: { success: true, data: { valid: ticketData } },
    contentType: "application/json"
  };
};
