const contentLib = require("/lib/xp/content");
const httpClientLib = require("/lib/http-client");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");

exports.prepareResponse = prepareResponse;
exports.getCharge = getCharge;
exports.updateWidget = updateWidget;

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
  config.setting_4 = (
    parseInt(charge.start) - donateTarget.data.chargePrice
  ).toFixed();
  config = JSON.stringify(config);
  let response = httpClientLib.request({
    url: "https://donatepay.ru/widgets/settings/save",
    method: "POST",
    headers: {
      "Cookie": "laravel_session=uRt3wGqA4xFRA8YXuVP7FTOmvi4Zp0p43gdPNfvh"
    },
    contentType: "application/x-www-form-urlencoded",
    body:
      "_token=3kUVfpFl5OidPaEm33UwjP89i18Ko3zGAlHOSIRW" +
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
