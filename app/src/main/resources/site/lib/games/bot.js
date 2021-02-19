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
exports.getComingGames = getComingGames;

function checkUser(params) {
  if (!params || !params.ticketId || !params.discordId)
    return { success: false };
  let cart = cartLib.getCartByQr(params.ticketId);
  if (!cart) return { success: false, message: "Билет не найден." };
  let user = getUserByTicket(params.ticketId);
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
      cartLib.markTicketUsed(params.ticketId);
    });
    return { success: true, turbo: cart.legendary };
  }
  return { success: false, message: "Билет не найден." };
}

function getUserByTicket(ticketId) {
  if (!ticketId) return null;
  let users = contentLib.query({
    query: "data.kosticonnect2021 = " + ticketId,
    start: 0,
    count: 1,
    contentTypes: [app.name + ":user"]
  });
  if (users.hits[0]) return users.hits[0];
  return null;
}

function getComingGames() {
  let now = new Date();
  now.setTime(now.getTime() + 60 * 60 * 1000);
  let result = [];
  let comingGames = contentLib.query({
    query: "data.datetime = dateTime('" + now.toISOString() + "')",
    start: 0,
    count: -1,
    contentTypes: [app.name + ":game"]
  }).hits;
  comingGames.forEach((game) => {
    let players = [];
    game.data.players ? game.data.players : [];
    game.data.players = norseUtils.forceArray(game.data.players);
    game.data.players.forEach((player) => {
      if (!player) return;
      player = contentLib.get({ key: player });
      if (player && player.data.discord)
        players.push({
          discord: player.data.discord,
          displayName: player.displayName
        });
      else if (player) players.push({ displayName: player.displayName });
    });
    result.push({
      displayName: game.displayName,
      description: game.data.description,
      players: players
    });
  });
  return { success: true, games: result };
}
