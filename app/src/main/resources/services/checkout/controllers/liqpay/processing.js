const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const httpClientLib = require("/lib/http-client");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const hashLib = require(libLocation + "hashLib");
const helpers = require(libLocation + "helpers");
const cartLib = require(libLocation + "cartLib");
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
    var cart = cartLib.getCart(req.cookies.cartId);

    if (!checkoutHelper.validateCartForCheckout(cart)) {
      return {
        redirect: true,
        url: sharedLib.getShopUrl()
      };
    }

    const data = hashLib.generateLiqpayData(
      checkoutLib.getLiqpayStatusData(cart)
    );
    const signature = hashLib.generateLiqpaySignature(data);
    const result = JSON.parse(
      httpClientLib.request({
        url: "https://www.liqpay.ua/api/request",
        method: "POST",
        connectionTimeout: 2000000,
        readTimeout: 500000,
        body: "data=" + data + "&signature=" + signature + "",
        contentType: "application/x-www-form-urlencoded"
      }).body
    );
    cart.transactionDate = new Date();
    if (result && result.status && result.status === "success") {
      cart.status = "paid";
      cart = checkoutHelper.checkoutCart(cart);
    } else {
      cart.status = "pending";
      cart = checkoutHelper.checkoutCart(cart);
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
