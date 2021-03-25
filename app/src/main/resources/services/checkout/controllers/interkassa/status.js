const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const helpers = require(libLocation + "helpers");
const cartLib = require(libLocation + "cartLib");
const sharedLib = require(libLocation + "sharedLib");
const checkoutLib = require(libLocation + "checkoutLib");

exports.post = function (req) {
  norseUtils.log(req);
  return;
  return {
    body: thymeleaf.render(
      resolve("../../templates/processing.html"),
      createModel()
    ),
    contentType: "text/html"
  };

  function createModel() {
    norseUtils.log(req);
    return {};
  }
};
