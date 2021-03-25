var portal = require("/lib/xp/portal");
var contentLib = require("/lib/xp/content");
var thymeleaf = require("/lib/thymeleaf");
var nodeLib = require("/lib/xp/node");

var libLocation = "../../site/lib/";
var contextLib = require(libLocation + "contextLib");
var helpers = require(libLocation + "helpers");
var cartLib = require(libLocation + "cartLib");
var sharedLib = require(libLocation + "sharedLib");
var norseUtils = require(libLocation + "norseUtils");
var storeLib = require(libLocation + "storeLib");

exports.get = function (req) {
  var view = resolve("cart.html");
  var site = portal.getSiteConfig();
  var shopUrl = portal.pageUrl({
    id: site.shopLocation
  });
  var cart = cartLib.getCart(req.cookies.cartId);
  for (var i = 0; i < cart.items.length; i++) {
    cart.items[i].priceBlock = storeLib.getPriceBlock(cart.items[i]._id);
  }
  return {
    body: thymeleaf.render(view, {
      cart: cart,
      pageComponents: helpers.getPageComponents(req, null, null, "Корзина"),
      shopUrl: shopUrl
    }),
    contentType: "text/html"
  };
};
