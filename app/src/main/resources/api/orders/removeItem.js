const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const mailsLib = require(libLocation + "mailsLib");
const cartLib = require("/lib/cartLib");
const adminLib = require(libLocation + "adminLib");

exports.post = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    let data = JSON.parse(req.body);
    if (!data.cartid || !adminLib.validateUserAdmin()) {
      return { success: false };
    }
    data.cartId = data.cartid;
    data.itemId = data.itemid;
    data.force = true;
    data.amount = 0;
    data.adminUser = true;
    const cart = cartLib.modify(data);
    if (cart) {
      return { success: true, data: cart };
    }
    return { success: false };
  }
};
