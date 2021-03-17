const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");

const libLocation = "../../site/lib/";
const contextLib = require(libLocation + "contextLib");
const cartLib = require(libLocation + "cartLib");
const norseUtils = require(libLocation + "norseUtils");
const adminLib = require(libLocation + "adminLib");

exports.post = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    let params = req.params;
    if (!params.cartId) {
      return { success: false };
    }
    params.adminUser = adminLib.validateUserAdmin();
    const result = contextLib.runAsAdmin(function () {
      return cartLib.modify(params);
    });
    if (!result) {
      return { success: false };
    }
    return { success: true, data: result };
  }
};
