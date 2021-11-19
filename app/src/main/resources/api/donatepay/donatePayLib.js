const contentLib = require("/lib/xp/content");
const httpClientLib = require("/lib/http-client");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");

exports.prepareResponse = prepareResponse;
exports.getCharge = getCharge;
exports.updateWidget = updateWidget;
exports.getToken = getToken;

function prepareResponse(charge, donateTarget) {
  return {
    id: donateTarget._id,
    donatePayName: charge.target,
    kostirpgName: donateTarget.displayName,
    goal: charge.goal,
    start: charge.start,
    current: {
      float: charge.start / donateTarget.data.chargePrice,
      int: (charge.start / donateTarget.data.chargePrice).toFixed()
    }
  };
}

function getCharge(id) {
  let donateTarget = contentLib.get({ key: id });
  let response = httpClientLib.request({
    url: donateTarget.data.url,
    method: "GET"
  });
  response = response.body;
  var regexp = new RegExp(
    "function getSettings(.|\r\n|\r|\n)+?}(.|\r\n|\r|\n)+?}",
    "gim"
  );
  response = response.match(regexp)[0];
  response = response.replace("return", "");
  response = response.replace("function getSettings() {", "");
  response = response.replace(/.$/, "");
  let settings;
  response = "settings = " + response;
  eval(response);
  return prepareResponse(settings, donateTarget);
}

function updateWidget(donateTarget) {
  let charge = getCharge(donateTarget._id);
  let config = JSON.parse(donateTarget.data.widgetConfig);
  let donateSettings = contentLib.get({
    key: donateTarget.data.donateSettings
  });
  config.setting_4 = (
    parseInt(charge.start) - donateTarget.data.chargePrice
  ).toFixed();
  config = JSON.stringify(config);
  let response = httpClientLib.request({
    url: "https://donatepay.ru/widgets/settings/save",
    method: "POST",
    headers: {
      "Cookie": "laravel_session=" + donateSettings.data.laravelSession
    },
    contentType: "application/x-www-form-urlencoded",
    body:
      "_token=" +
      getToken(donateTarget._id) +
      "&widget_id=" +
      donateTarget.data.widgetId +
      "&data=" +
      config
  });
  if (response.status !== 201) {
    return { success: false };
  }
  return { success: true, data: { charge: charge } };
}

function getToken(id) {
  let donateTarget = contentLib.get({ key: id });
  let donateSettings = contentLib.get({
    key: donateTarget.data.donateSettings
  });
  let response = httpClientLib.request({
    url: "https://donatepay.ru/donation/fundraiser",
    method: "GET",
    headers: {
      "Cookie": "laravel_session=" + donateSettings.data.laravelSession
    }
  });
  let regex = new RegExp('name=.*?_token.+?.+?".+?"', "gim");
  let data = response.body.match(regex)[0];
  data = data.substring(21);
  data = data.substring(0, data.length - 1);
  return data;
}
