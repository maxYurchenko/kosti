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

const apiUrl = "http://testapi.novaposhta.ua/v2.0/en/save_warehouse/json/";
const apiKey = "ecc4e836cab6d9c8356bd4ee46ff14a7";

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
    const response = httpClient.request({
      url: apiUrl,
      method: "POST",
      body: JSON.stringify({
        apiKey: apiKey,
        modelName: "InternetDocument",
        calledMethod: "save",
        methodProperties: {
          NewAddress: "1",
          PayerType: "Sender",
          PaymentMethod: "NonCash",
          CargoType: "Parcel",
          VolumeGeneral: "0.1",
          Weight: cart.itemsWeight,
          ServiceType: "WarehouseWarehouse",
          SeatsAmount: "1",
          Description: "одежда",
          Cost: "100",
          CitySender: "e221d627-391c-11dd-90d9-001a92567626",
          Sender: "5ace4a2e-13ee-11e5-add9-005056887b8d",
          SenderAddress: "d492290b-55f2-11e5-ad08-005056801333",
          ContactSender: "613b77c4-1411-11e5-ad08-005056801333",
          SendersPhone: "380991234567",
          RecipientName: cart.name + " " + cart.surname,
          RecipientType: "PrivatePerson",
          RecipientsPhone: cart.phone,
          DateTime: moment().format("DD-MM-YYYY")
        }
      }),
      contentType: "application/json"
    });
    norseUtils.log(JSON.parse(response.body));

    if (cart) {
      return { success: true, data: cart };
    }
    return { success: false };
  }
};
