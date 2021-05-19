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
    let model = checkoutHelper.getCheckoutMainModel(req);
    model.cart = cartLib.modifyCartWithParams(model.cart._id, req.params);
    model.stepView = thymeleaf.render(
      resolve("../templates/stepTwo.html"),
      createStepTwoModel(model.cart)
    );
    const user = userLib.getCurrentUser();
    if (user && req.params.saveUserData === "on") {
      userLib.editUser({
        postalCode: req.params.index,
        address: req.params.address,
        country: req.params.country,
        city: req.params.city,
        phone: req.params.phone,
        lastName: req.params.surname,
        firstName: req.params.name,
        id: user._id
      });
    }
    model.shipping = "active";
    return model;

    function createStepTwoModel(cart) {
      return {
        params: req.params,
        shopUrl: sharedLib.getShopUrl(),
        cartUrl: sharedLib.generateNiceServiceUrl("cart"),
        shipping: shippingLib.getShipping(req.params.country, cart.itemsWeight),
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
