const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const helpers = require(libLocation + "helpers");
const cartLib = require("/lib/cartLib");
const sharedLib = require(libLocation + "sharedLib");
const checkoutLib = require(libLocation + "checkoutLib");
const checkoutHelper = require("../../lib/helper");

exports.post = function (req) {
  const model = createModel();
  if (model.redirect) {
    return sharedLib.redirect(model);
  }
  return {
    body: thymeleaf.render(resolve("../../templates/processing.html"), model),
    contentType: "text/html"
  };

  function createModel() {
    const params = req.params;
    let cart = cartLib.getCart(req.cookies.cartId);

    if (!checkoutHelper.validateCartForCheckout(cart)) {
      return {
        redirect: true,
        url: sharedLib.getShopUrl()
      };
    }

    cart.transactionDate = new Date();
    cart.status = "pending";
    cart.ik_inv_id = params.ik_inv_id;
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
