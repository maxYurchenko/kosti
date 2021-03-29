var norseUtils = require("../site/lib/norseUtils");
var checkoutLib = require("../site/lib/storeLib");

exports.run = function () {
  checkoutLib.checkLiqpayOrderStatus();
  checkoutLib.checkInterkassaOrderStatus();
};
