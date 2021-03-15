const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const adminLib = require("/lib/xp/admin");

const libLocation = "../../../site/lib/";
const helpers = require(libLocation + "helpers");
const norseUtils = require(libLocation + "norseUtils");
const statisticsLib = require(libLocation + "statisticsLib");
const cartLib = require(libLocation + "cartLib");

exports.get = function (req) {
  let paidCarts = cartLib.getCreatedCarts({ status: ["paid", "shipped"] });
  let failedCarts = cartLib.getCreatedCarts({ status: "failed" });
  return {
    body: thymeleaf.render(resolve("statistics.html"), {
      pageComponents: helpers.getPageComponents(req),
      paidCarts: paidCarts,
      failedCarts: failedCarts
    }),
    contentType: "text/html"
  };
};
