const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const mailsLib = require(libLocation + "mailsLib");
const cartLib = require(libLocation + "cartLib");
const adminLib = require(libLocation + "adminLib");
const statisticsLib = require(libLocation + "statisticsLib");

exports.get = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    if (!adminLib.validateUserAdmin()) {
      return { success: false };
    }
    if (!req.params) {
      req.params = {};
    }
    if (!req.params.end || !req.params.start) {
      req.params = statisticsLib.getFirstAndLastDayOfMonth(req.params);
    }
    const paidCarts = cartLib.getCreatedCarts({
      status: ["paid", "shipped"],
      start: req.params.start,
      end: req.params.end,
      count: -1,
      statistics: true
    });
    return {
      success: true,
      data: statisticsLib.getStatisticsPerItem(paidCarts.hits),
      message: "Items sold"
    };
  }
};
