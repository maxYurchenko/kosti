const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const checkoutLib = require(libLocation + "checkoutLib");
const adminLib = require(libLocation + "adminLib");

exports.post = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    if (!adminLib.validateUserAdmin()) {
      return { success: false };
    }
    checkoutLib.checkLiqpayOrderStatus();
    checkoutLib.checkInterkassaOrderStatus();
    return { success: true };
  }
};
