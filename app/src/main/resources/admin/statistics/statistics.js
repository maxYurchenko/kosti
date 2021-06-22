const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const helpers = require(libLocation + "helpers");
const norseUtils = require(libLocation + "norseUtils");
const statisticsLib = require(libLocation + "statisticsLib");
const cartLib = require("/lib/cartLib");
const adminLib = require(libLocation + "adminLib");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return false;
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
  const failedCarts = cartLib.getCreatedCarts({
    status: "failed",
    start: req.params.start,
    end: req.params.end,
    count: -1,
    statistics: true
  });
  const income = statisticsLib.calculateCartPrices(paidCarts.hits);
  const itemsStatistics = statisticsLib.getStatisticsPerItem(paidCarts.hits);
  const uniqueBuyersAmount = statisticsLib.getUniqueBuyersAmount(
    paidCarts.hits
  );
  return {
    body: thymeleaf.render(resolve("statistics.html"), {
      pageComponents: helpers.getPageComponents(req),
      paidCarts: paidCarts,
      failedCarts: failedCarts,
      income: income,
      params: req.params,
      itemsStatistics: itemsStatistics,
      uniqueBuyersAmount: uniqueBuyersAmount.length
    }),
    contentType: "text/html",
    pageContributions: {
      bodyEnd: [
        "<script src='" +
          portal.assetUrl({ path: "js/statistics.js" }) +
          "'></script>"
      ]
    }
  };
};
