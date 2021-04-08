const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const helpers = require(libLocation + "helpers");
const norseUtils = require(libLocation + "norseUtils");
const adminLib = require(libLocation + "adminLib");
const donatepay = require("/api/donatepay/list");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return false;
  }
  const donations = thymeleaf.render(resolve("donations.html"), {
    donations: donatepay.beautifyDonations(donatepay.getDonations())
  });
  return {
    body: thymeleaf.render(resolve("wrapper.html"), {
      pageComponents: helpers.getPageComponents(req),
      donations: donations
    }),
    contentType: "text/html",
    pageContributions: {
      bodyEnd: [
        "<script src='" +
          portal.assetUrl({ path: "js/donatepay.js" }) +
          "'></script>"
      ]
    }
  };
};
