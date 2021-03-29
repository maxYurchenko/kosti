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

    if (
      params.ik_co_id !== app.config.interkassaID ||
      params.ik_pm_no !== cart.ik_id
    ) {
      cart.transactionDate = new Date();
      cart.status = "paid";
      cart.ik_inv_id = params.ik_inv_id;
      cart = checkoutHelper.checkoutCart(cart);
    } else {
      cart = cartLib.modifyCartWithParams(cart._id, {
        status: "pending",
        ik_inv_id: params.ik_inv_id
      });
    }

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
