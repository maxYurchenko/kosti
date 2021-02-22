const norseUtils = require("../norseUtils");
const contentLib = require("/lib/xp/content");
const portalLib = require("/lib/xp/portal");
const userLib = require("../userLib");
const formSharedLib = require("formSharedLib");
const formPlayerLib = require("formPlayerLib");
const festivalSharedLib = require("festivalSharedLib");
const i18nLib = require("/lib/xp/i18n");
const util = require("/lib/util");
const contextLib = require("../contextLib");
const cartLib = require("../cartLib");
const sharedLib = require("../sharedLib");
const cacheLib = require("../cacheLib");

exports.checkUser = checkUser;
exports.getComingGames = getComingGames;
exports.getCurrentEvents = getCurrentEvents;

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
  let result = [];
  let comingGames = contentLib.query({
    query: getDateTimeFilter(),
    start: 0,
    count: -1,
    contentTypes: [app.name + ":game"]
  }).hits;
  let tables = null;
  for (let i = 0; i < comingGames.length; i++) {
    let game = comingGames[i];
    if (!tables) tables = festivalSharedLib.getTablesStartNum(game._id);
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
    let master = contentLib.get({ key: game.data.master });
    result.push({
      displayName: game.displayName,
      description: game.data.description,
      table: tables + i,
      master: master
        ? {
            discord: master.data.discord,
            displayName: master.displayName
          }
        : null,
      players: players
    });
  }
  return { success: true, games: result };
}

function getCurrentEvents() {
  let result = [];
  let events = contentLib.query({
    query: getDateTimeFilter(),
    start: 0,
    count: -1,
    contentTypes: [app.name + ":festivalEvent"]
  }).hits;
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    result.push({
      displayName: event.displayName,
      description: event.data.description,
      dateTimeStart: event.data.datetime,
      dateTimeEnd: event.data.datetimeEnd
    });
  }
  return { success: true, games: result };
}

function getDateTimeFilter() {
  let prepareDate = new Date();
  prepareDate.setTime(prepareDate.getTime() - 15 * 60 * 1000);
  let now = new Date();
  return (
    "data.datetime < dateTime('" +
    prepareDate.toISOString() +
    "') and data.datetimeEnd > dateTime('" +
    now.toISOString() +
    "')"
  );
}
