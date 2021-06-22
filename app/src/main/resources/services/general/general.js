const libLocation = "../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const helpers = require(libLocation + "helpers");
const votesLib = require(libLocation + "votesLib");
const cartLib = require("/lib/cartLib");
const checkoutLib = require(libLocation + "checkoutLib");
const blogLib = require(libLocation + "blogLib");
const homepageLib = require(libLocation + "homepageLib");
const newsletterLib = require(libLocation + "newsletterLib");
const monsterLib = require(libLocation + "monsterLib");
const mailsLib = require(libLocation + "mailsLib");
const adminLib = require(libLocation + "adminLib");
const storeLib = require(libLocation + "storeLib");
const formPlayerLib = require(libLocation + "games/formPlayerLib");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return {
      body: "not an admin",
      contentType: "text/html"
    };
  }
  var params = req.params;
  switch (params.action) {
    case "fixPermissions":
      helpers.fixPermissions(params.repo);
      break;
    case "fixVotesTimestamps":
      votesLib.fixVotesTimestamps();
      break;
    case "fixCartDate":
      cartLib.fixCartDate();
      break;
    case "fixCartPrice":
      cartLib.fixCartPrice(params.force);
      break;
    case "fixItemIds":
      cartLib.fixItemIds();
      break;
    case "getEmailsFromNewsletter":
      var emails = newsletterLib.getSubscribedEmails();
      norseUtils.log(emails);
      break;
    case "removeUnusedVotes":
      votesLib.removeUnusedVotes();
      break;
    case "fixPendingOrders":
      checkoutLib.checkLiqpayOrderStatus();
      checkoutLib.checkInterkassaOrderStatus();
      break;
    case "updateSchedule":
      blogLib.updateSchedule();
      break;
    case "updateCache":
      homepageLib.updateCache();
      break;
    case "fixCR":
      monsterLib.fixCR();
      break;
    case "resendConfirmationMail":
      var cart = cartLib.getCart(params.id);
      mailsLib.sendMail("orderCreated", cart.email, {
        cart: cart
      });
      break;
    case "fixgamesplayers":
      formPlayerLib.checkPlayersCartsBooking();
      break;
    case "fixgamedate":
      formPlayerLib.updateGameDate();
      break;
    case "checkProductInventory":
      storeLib.checkProductsStock();
      break;
  }
  return {
    body: "ok",
    contentType: "text/html"
  };
};
