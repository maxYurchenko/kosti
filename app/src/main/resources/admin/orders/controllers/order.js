const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const helpers = require(libLocation + "helpers");
const norseUtils = require(libLocation + "norseUtils");
const userLib = require("/lib/userLib");
const cartLib = require(libLocation + "cartLib");
const adminLib = require(libLocation + "adminLib");
const sharedLib = require(libLocation + "sharedLib");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return false;
  }
  let cart = cartLib.getCart(req.params.id);
  cart.addressLatinic = sharedLib.transliterate(cart.address);
  cart.cityLatinic = sharedLib.transliterate(cart.city);
  cart.nameLatinic = sharedLib.transliterate(cart.name);
  cart.surnameLatinic = sharedLib.transliterate(cart.surname);
  return {
    body: thymeleaf.render(resolve("../templates/order.html"), {
      pageComponents: helpers.getPageComponents(req),
      cart: cart,
      products: contentLib.query({
        start: 0,
        count: -1,
        contentTypes: [app.name + ":product"]
      }).hits
    }),
    contentType: "text/html",
    pageContributions: {
      bodyEnd: [
        "<script src='" +
          portal.assetUrl({ path: "js/order.js" }) +
          "'></script>"
      ]
    }
  };
};
