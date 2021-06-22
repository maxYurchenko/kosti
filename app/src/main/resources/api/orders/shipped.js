const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const mailsLib = require(libLocation + "mailsLib");
const cartLib = require("/lib/cartLib");
const adminLib = require(libLocation + "adminLib");

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
    let trackNum = null;
    let cart = cartLib.getCart(data.id);
    if (data.track) {
      trackNum = data.track;
      cart = cartLib.setUserDetails(data.id, { trackNum: data.track });
    } else {
      trackNum = cart.trackNum;
    }
    if (!trackNum) {
      return { success: false };
    }
    mailsLib.sendMail("sendShippedMail", cart.email, {
      cart: cart
    });
    if (cart) {
      return { success: true, data: cart };
    }
    return { success: false };
  }
};
