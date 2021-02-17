const norseUtils = require("../norseUtils");
const contentLib = require("/lib/xp/content");
const portalLib = require("/lib/xp/portal");
const userLib = require("../userLib");
const formSharedLib = require("formSharedLib");
const formPlayerLib = require("formPlayerLib");
const i18nLib = require("/lib/xp/i18n");
const util = require("/lib/util");
const contextLib = require("../contextLib");
const cartLib = require("../cartLib");
const sharedLib = require("../sharedLib");
const cacheLib = require("../cacheLib");

exports.checkUser = checkUser;

function checkUser(params) {
  if (!params || !params.ticket || !params.discordId) return { success: false };
  let cart = cartLib.getCartByQr(params.ticket);
  if (!cart) return { success: false, message: "Билет не найден." };
  let user = getUserByTicket(params.ticket);
  if (user) {
    if (!user.data.discord) {
      user.data.discord = params.discordId;
      contextLib.runAsAdmin(function () {
        formPlayerLib.updateEntity(user);
      });
    }
    return { success: true, turbo: cart.legendary };
  }
  if (!cart.qrActivated) {
    contextLib.runAsAdmin(function () {
      cartLib.markTicketUsed(params.ticket);
    });
    return { success: true, turbo: cart.legendary };
  }
  return { success: false, message: "Билет не найден." };
}

function getUserByTicket(ticket) {
  if (!ticket) return null;
  let users = contentLib.query({
    query: "data.kosticonnect2021 = " + ticket,
    start: 0,
    count: 1,
    contentTypes: [app.name + ":user"]
  });
  if (users.hits[0]) return users.hits[0];
  return null;
}
