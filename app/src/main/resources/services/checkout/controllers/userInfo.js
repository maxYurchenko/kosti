const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const cartLib = require(libLocation + "cartLib");
const sharedLib = require(libLocation + "sharedLib");
const checkoutLib = require(libLocation + "checkoutLib");

exports.get = function (req) {
  return {
    body: thymeleaf.render(
      resolve("../templates/checkout.html"),
      createModel()
    ),
    contentType: "text/html"
  };

  function createModel() {
    var model = checkoutLib.getCheckoutMainModel(req);
    model.stepView = thymeleaf.render(
      resolve("../templates/stepOne.html"),
      createStepOneModel(model.cart, req)
    );
    return model;

    function createStepOneModel(cart, req) {
      return {
        shopUrl: sharedLib.getShopUrl(),
        agreementPage: portal.pageUrl({
          id: portal.getSiteConfig().agreementPage
        }),
        cartUrl: sharedLib.generateNiceServiceUrl("cart"),
        params: req.params,
        cart: cart
      };
    }
  }
};