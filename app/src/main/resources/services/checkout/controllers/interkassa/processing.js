const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const httpClientLib = require("/lib/http-client");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const hashLib = require(libLocation + "hashLib");
const helpers = require(libLocation + "helpers");
const cartLib = require("/lib/cartLib");
const sharedLib = require(libLocation + "sharedLib");
const checkoutLib = require(libLocation + "checkoutLib");

exports.post = function (req) {
  return generateCheckoutPage(req);
};

exports.get = function (req) {
  return generateCheckoutPage(req);
};

function generateCheckoutPage(req) {
  let cart = cartLib.getCart(req.cookies.cartId);
  let params = req.params;
  if (params.ik_inv_st == "success") {
    cart.transactionDate = getTransactionDate();
    checkoutLib.checkoutCart(cart, "paid");
  } else if (params.ik_inv_st == "fail" || params.ik_inv_st == "canceled") {
    contextLib.runAsAdmin(function () {
      cart = cartLib.modifyCartWithParams(cart._id, { status: "failed" });
    });
  } else (params.ik_inv_st == "waitAccept") {
    checkoutLib.checkoutCart(cart, "pending");
  }
  return checkoutLib.renderSuccessPage(
    req,
    cart,
    params.ik_inv_st != "success"
  );

  function getTransactionDate() {
    if (params.ik_inv_prc) {
      return new Date(params.ik_inv_prc);
    } else if (params.ik_inv_crt) {
      return new Date(params.ik_inv_crt);
    }
    return new Date();
  }
}
