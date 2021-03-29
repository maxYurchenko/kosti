const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const httpClient = require("/lib/http-client");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const mailsLib = require(libLocation + "mailsLib");
const cartLib = require(libLocation + "cartLib");
const adminLib = require(libLocation + "adminLib");
const moment = require(libLocation + "moment");
const novaposhtaLib = require(libLocation + "novaposhtaLib");

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
    const cart = cartLib.getCart(data.id);
    if (cart.country !== "ua") {
      return { success: false };
    }
    try {
      const novaposhtaData = novaposhtaLib.getInternetDocumentData(cart);
      const document = novaposhtaLib.makeRequest(
        "InternetDocument",
        "save",
        novaposhtaData
      );
      if (cart) {
        return { success: true, data: document };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  }
};
