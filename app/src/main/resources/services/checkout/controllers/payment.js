const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const cartLib = require(libLocation + "cartLib");
const sharedLib = require(libLocation + "sharedLib");
const checkoutLib = require(libLocation + "checkoutLib");
const userLib = require("/lib/userLib");
const shippingLib = require("../lib/shipping");
const checkoutHelper = require("../lib/helper");

exports.post = function (req) {
  return {
    body: thymeleaf.render(
      resolve("../templates/checkout.html"),
      createModel()
    ),
    contentType: "text/html"
  };

  function createModel() {
    var model = checkoutHelper.getCheckoutMainModel(req);
    req.params.status = "created";
    var user = userLib.getCurrentUser();
    if (user) {
      req.params.userRelation = user._id;
    }
    var shipping = shippingLib.getShipping(model.cart.country);
    shipping = shippingLib.getShippingById(shipping, req.params.shipping);
    model.cart = cartLib.modifyCartWithParams(model.cart._id, req.params);
    model.stepView = thymeleaf.render(
      resolve("../templates/stepThree.html"),
      createStepThreeModel(req, model.cart)
    );
    model.payment = "active";
    return model;

    function createStepThreeModel(req, cart) {
      return {
        shopUrl: sharedLib.getShopUrl(),
        cart: cart,
        cartUrl: sharedLib.generateNiceServiceUrl("cart"),
        error: req.params.error
      };
    }
  }
};
