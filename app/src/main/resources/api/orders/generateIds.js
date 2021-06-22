const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const cartLib = require("/lib/cartLib");
const adminLib = require(libLocation + "adminLib");

exports.post = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    const data = JSON.parse(req.body);
    if (!data.id || !adminLib.validateUserAdmin()) {
      return { success: false };
    }
    const cart = cartLib.generateItemsIds(data.id);
    if (cart) {
      return { success: true, data: cart };
    }
    return { success: false };
  }
};
