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
exports.getGames = getGames;
exports.getEvents = getEvents;

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

function getGames(filter, userId) {
  let query = null;
  switch (filter) {
    case "today":
      query = getTodayTimeFilter();
      break;
    case "user":
      query = getUserFilter(userId);
      break;
    default:
      query = getComingTimeFilter();
      break;
  }
  if (!query) return { success: false };
  let result = [];
  let comingGames = contentLib.query({
    query: query,
    start: 0,
    count: -1,
    contentTypes: [app.name + ":game"],
    sort: "_parentPath ASC"
  }).hits;
  let tables = 0;
  let j = 0;
  for (let i = 0; i < comingGames.length; i++) {
    let game = comingGames[i];
    let currTables = festivalSharedLib.getTablesStartNum(game._id);
    if (tables !== currTables) {
      tables = currTables;
      j = 0;
    }
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
      table: currTables + j,
      dateTimeStart: game.data.datetime,
      dateTimeEnd: game.data.datetimeEnd,
      master: master
        ? {
            discord: master.data.discord,
            displayName: master.displayName
          }
        : null,
      players: players
    });
    j++;
  }
  return { success: true, games: result };
}

function getEvents(filter) {
  let query = null;
  switch (filter) {
    case "today":
      query = getTodayTimeFilter();
      break;
    default:
      query = getComingTimeFilter();
      break;
  }
  let result = [];
  let events = contentLib.query({
    query: query,
    start: 0,
    count: -1,
    contentTypes: [app.name + ":festivalEvent"]
  }).hits;
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    result.push({
      displayName: event.displayName,
      description: event.data.description.replace(/(<([^>]+)>)/gi, ""),
      dateTimeStart: event.data.datetime,
      dateTimeEnd: event.data.datetimeEnd
    });
  }
  return { success: true, games: result };
}

function getComingTimeFilter() {
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

function getTodayTimeFilter() {
  let todayStart = new Date();
  let todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  return (
    "data.datetime < dateTime('" +
    todayEnd.toISOString() +
    "') and data.datetimeEnd > dateTime('" +
    todayStart.toISOString() +
    "')"
  );
}

function getUserFilter(userId) {
  let users = contentLib.query({
    query: "data.discord = '" + userId + "'",
    start: 0,
    count: -1,
    contentTypes: [app.name + ":user"]
  }).hits;
  let ids = [];
  users.forEach((u) => {
    ids.push(u._id);
  });
  if (ids.length > 0) {
    return (
      "data.players IN ('" +
      ids.join("','") +
      "') OR data.master IN ('" +
      ids.join("','") +
      "')"
    );
  }
  return false;
}
