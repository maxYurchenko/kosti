const httpClientLib = require("/lib/http-client");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const adminLib = require(libLocation + "adminLib");
const moment = require(libLocation + "moment");
const socNotLib = require(libLocation + "socialNotificationLib");

exports.post = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    if (!adminLib.validateUserAdmin()) {
      //return { success: false };
    }

    let settings = getSettings();
    return {
      success: true
    };
  }
};

function getSettings() {
  let response = httpClientLib.request({
    url: "https://donatepay.ru/donation/fundraiser",
    method: "GET",
    headers: {
      "Cookie": "laravel_session=" + "DDkc97YXcRyGX8dzmaD6pNJLa9x9TRlNChlEHnnY"
    }
  });
  response = response.body;
  var regexp = new RegExp(
    '<form(.|\r\n|\r|\n)+? id=\\"settings\\"(.|\r\n|\r|\n)+?</form>',
    "gim"
  );
  let form = response.match(regexp)[0];
  let inputRegex = new RegExp("<input(.|\r\n|\r|\n)+?>", "gim");
  let inputs = form.match(inputRegex);
  let selectRegex = new RegExp("<select(.|\r\n|\r|\n)+?>", "gim");
  let selects = form.match(selectRegex);
  let nameRegex = new RegExp(' name=.*?".*?"', "gim");
  let valueRegex = new RegExp(' value=.*?".*?"', "gim");
  let result = {};
  inputs = inputs.concat(selects);
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let name = input.match(nameRegex)[0];
    name = name.replace(/ name=.*?"/, "");
    name = name.replace(/.$/, "");
    if (name === "widget_id") continue;
    if (name === "_token") continue;
    let value = input.match(valueRegex)[0];
    value = value.replace(/ value=.*?"/, "");
    value = value.replace(/.$/, "");
    if (value) result[name] = value;
  }
  return result;
}
