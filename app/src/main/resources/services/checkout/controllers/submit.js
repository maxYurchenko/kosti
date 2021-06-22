const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const cartLib = require("/lib/cartLib");
const hashLib = require(libLocation + "hashLib");
const checkoutLib = require(libLocation + "checkoutLib");
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
    if (req.params.method === "liqpay") {
      getLiqpayModel();
    } else if (req.params.method === "interkassa") {
      getInterkassaModel();
    }
    return model;

    function getLiqpayModel() {
      model.cart = cartLib.modifyCartWithParams(model.cart._id, {
        paymentMethod: "liqpay"
      });
      const liqpayData = hashLib.generateLiqpayData(
        checkoutLib.getLiqpayData(model.cart)
      );
      model.checkoutForm = thymeleaf.render(
        resolve("../templates/liqpay/form.html"),
        {
          liqpayData: liqpayData,
          signature: hashLib.generateLiqpaySignature(liqpayData)
        }
      );
    }

    function getInterkassaModel() {
      if (model.cart) {
        model.cart = cartLib.modifyCartWithParams(model.cart._id, {
          paymentMethod: "interkassa"
        });
        model.checkoutForm = thymeleaf.render(
          resolve("../templates/interkassa/form.html"),
          {
            cart: model.cart,
            ik_id: model.ik_id,
            description: checkoutLib.getCartDescription(model.cart)
          }
        );
      }
    }
  }
};
