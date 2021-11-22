const httpClientLib = require("/lib/http-client");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const adminLib = require(libLocation + "adminLib");
const moment = require(libLocation + "moment");
const socNotLib = require(libLocation + "socialNotificationLib");
const donatePayLib = require("donatePayLib");

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
        charge: donatePayLib.getCharge(req.params.id)
      }
    };
  }
};

exports.post = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    if (!adminLib.validateUserAdmin()) {
      //return { success: false };
    }
    let charge;
    let donateTarget = contentLib.get({ key: req.params.id });
    if (donateTarget.data.deleteChargeStrategy === "vitya") {
      sendVityaNotification();
    } else {
      charge = donatePayLib.updateWidget(donateTarget);
      if (charge.success) return charge;
      sendVityaNotification();
    }
    return {
      data: { charge: charge },
      success: true
    };
  }
};

function sendVityaNotification() {
  socNotLib.sendTelegramMessage({
    body: charge.target + " использовал один заряд.",
    chatId: app.config.telegramAdminChat,
    botId: app.config.telegramBotToken
  });
}
