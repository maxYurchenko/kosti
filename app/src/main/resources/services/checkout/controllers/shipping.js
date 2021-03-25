const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const cartLib = require(libLocation + "cartLib");
const sharedLib = require(libLocation + "sharedLib");
const checkoutLib = require(libLocation + "checkoutLib");
const shippingLib = require("../lib/shipping");

exports.post = function (req) {
  return {
    body: thymeleaf.render(
      resolve("../templates/checkout.html"),
      createModel()
    ),
    contentType: "text/html"
  };

  function createModel() {
    var model = checkoutLib.getCheckoutMainModel(req);
    if (!model.cart.ik_id || model.cart.ik_id == "") {
      req.params.ik_id =
        req.params.surname.toLowerCase() + "_" + new Date().getTime();
    }
    model.cart = cartLib.modifyCartWithParams(model.cart._id, req.params);
    model.stepView = thymeleaf.render(
      resolve("../templates/stepTwo.html"),
      createStepTwoModel(model.cart)
    );
    model.shipping = "active";
    return model;

    function createStepTwoModel(cart) {
      var site = portal.getSiteConfig();
      var shipping = contentLib.get({ key: site.shipping });
      shipping = shippingLib.getShipping(req.params.country, cart.itemsWeight);
      return {
        params: req.params,
        shopUrl: sharedLib.getShopUrl(),
        cartUrl: sharedLib.generateNiceServiceUrl("cart"),
        shipping: shipping,
        cart: cart,
        address:
          req.params.country.replaceAll(" ", "+") +
          "," +
          req.params.city.replaceAll(" ", "+") +
          "," +
          req.params.address.replaceAll(" ", "+")
      };
    }
  }
};
