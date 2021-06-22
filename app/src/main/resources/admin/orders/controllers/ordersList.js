const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const helpers = require(libLocation + "helpers");
const norseUtils = require(libLocation + "norseUtils");
const cartLib = require("/lib/cartLib");
const adminLib = require(libLocation + "adminLib");
const countries = require(libLocation + "misc/countries");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return false;
  }
  let params = req.params;
  params.sort = "transactionDate DESC, _ts DESC";
  const carts = cartLib.getCreatedCarts(req.params);
  return {
    body: thymeleaf.render(resolve("../templates/ordersList.html"), {
      pageComponents: helpers.getPageComponents(req),
      pagination: helpers.getPagination(
        "/orders",
        carts.total,
        30,
        params.page ? parseInt(params.page) : 0,
        req.params
      ),
      carts: carts.hits,
      params: req.params,
      countries: countries,
      products: contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":product"]
      }).hits
    }),
    contentType: "text/html"
  };
};
