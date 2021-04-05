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
    const cart = cartLib.getCart(req.cookies.cartId);
    try {
      const price = novaposhtaLib.makeRequest(
        "InternetDocument",
        "getDocumentPrice",
        {
          CitySender: "e221d627-391c-11dd-90d9-001a92567626",
          CityRecipient: data.cityRecipient,
          Weight: cart.itemsWeight,
          ServiceType: "WarehouseWarehouse",
          Cost: "1000",
          CargoType: "Parcel",
          SeatsAmount: "1"
        }
      );
      return { success: true, data: price[0] };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
};
