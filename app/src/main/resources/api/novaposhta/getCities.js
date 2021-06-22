const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const httpClient = require("/lib/http-client");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const mailsLib = require(libLocation + "mailsLib");
const cartLib = require("/lib/cartLib");
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
    try {
      const cities = novaposhtaLib.makeRequest("Address", "searchSettlements", {
        Limit: "10",
        CityName: data.query
      });
      return { success: true, data: cities[0].Addresses };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
};
