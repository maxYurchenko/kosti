const httpClientLib = require("/lib/http-client");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const adminLib = require(libLocation + "adminLib");
const moment = require(libLocation + "moment");
const socNotLib = require(libLocation + "socialNotificationLib");
const donatePayLib = require("donatePayLib");

const donateSettings = "86772271-8360-4055-9e66-286f1370484a";

exports.get = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    if (!adminLib.validateUserAdmin()) {
      //return { success: false };
    }
    return {
      success: true,
      data: {
        charge: getCharges()
      }
    };
  }
};

function getCharges() {
  let settings = contentLib.get({ key: donateSettings });
  let result = [];
  settings.data.donateTarget = norseUtils.forceArray(
    settings.data.donateTarget
  );
  settings.data.donateTarget.forEach((donateTargetId) => {
    result.push(donatePayLib.getCharge(donateTargetId));
  });
  return result;
}
