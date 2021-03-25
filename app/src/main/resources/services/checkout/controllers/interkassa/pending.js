const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const helpers = require(libLocation + "helpers");
const cartLib = require(libLocation + "cartLib");
const sharedLib = require(libLocation + "sharedLib");
const checkoutLib = require(libLocation + "checkoutLib");
const checkoutHelper = require("../../lib/helper");

exports.post = function (req) {
  return {
    body: thymeleaf.render(
      resolve("../../templates/processing.html"),
      createModel()
    ),
    contentType: "text/html"
  };

  function createModel() {
    const params = req.params;
    let cart = cartLib.getCart(req.cookies.cartId);

    cart.transactionDate = new Date();
    cart.status = "pending";
    cart = checkoutHelper.checkoutCart(cart);

    return {
      shopUrl: sharedLib.getShopUrl(),
      cart: cart,
      pageComponents: helpers.getPageComponents(
        req,
        "footerScripts",
        null,
        "Оплата и доставка"
      )
    };
  }
};
