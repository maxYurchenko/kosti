var portal = require("/lib/xp/portal");
var contentLib = require("/lib/xp/content");
var thymeleaf = require("/lib/thymeleaf");

var libLocation = "/site/lib/";
var helpers = require(libLocation + "helpers");
var norseUtils = require(libLocation + "norseUtils");
var cartLib = require(libLocation + "cartLib");
var adminLib = require(libLocation + "adminLib");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return false;
  }
  var params = req.params;
  var carts = cartLib.getCreatedCarts(req.params).hits;
  return {
    body: thymeleaf.render(resolve("../templates/ordersList.html"), {
      pageComponents: helpers.getPageComponents(req),
      pagination: helpers.getPagination(
        null,
        carts.total,
        30,
        params.page ? parseInt(params.page) : 0,
        req.params
      ),
      carts: carts,
      params: req.params,
      products: contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":product"]
      }).hits
    }),
    contentType: "text/html"
  };
};
