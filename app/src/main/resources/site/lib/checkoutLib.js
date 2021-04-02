const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const httpClientLib = require("/lib/http-client");

const contextLib = require("contextLib");
const norseUtils = require("norseUtils");
const helpers = require("helpers");
const cartLib = require("cartLib");
const mailsLib = require("mailsLib");
const sharedLib = require("sharedLib");
const promosLib = require("promosLib");
const storeLib = require("storeLib");
const checkoutHelper = require("/services/checkout/lib/helper");
const hashLib = require("hashLib");

exports.getLiqpayData = getLiqpayData;
exports.getLiqpayStatusData = getLiqpayStatusData;
exports.getCartDescription = getCartDescription;
exports.checkLiqpayOrderStatus = checkLiqpayOrderStatus;
exports.checkInterkassaOrderStatus = checkInterkassaOrderStatus;

function getLiqpayData(cart) {
  var description = getCartDescription(cart);
  return {
    public_key: app.config.liqpayPublicKey,
    version: "3",
    action: "pay",
    currency: "UAH",
    description: description,
    order_id: cart.userId,
    result_url: sharedLib.generateNiceServiceUrl(
      "/payment-processing",
      null,
      true
    ),
    amount: cart.price.totalDiscount
  };
}

function getCartDescription(cart) {
  var description = "";
  for (var i = 0; i < cart.items.length; i++) {
    description +=
      cart.items[i].displayName +
      (cart.items[i].itemSize ? " " + cart.items[i].itemSize : "") +
      " x" +
      cart.items[i].amount +
      ", ";
  }
  description = description.substring(0, description.length - 2);
  return description;
}

function getLiqpayStatusData(cart) {
  return {
    public_key: app.config.liqpayPublicKey,
    version: "3",
    action: "status",
    order_id: cart.userId
  };
}

function checkLiqpayOrderStatus() {
  var carts = cartLib.getPendingLiqpayCarts();
  norseUtils.log(carts.length + " total liqpay pending carts found.");
  for (var i = 0; i < carts.length; i++) {
    let cart = carts[i];
    norseUtils.log("fixing cart " + carts[i].userId);
    var data = hashLib.generateLiqpayData(getLiqpayStatusData(carts[i]));
    var signature = hashLib.generateLiqpaySignature(data);
    var result = JSON.parse(
      httpClientLib.request({
        url: "https://www.liqpay.ua/api/request",
        method: "POST",
        connectionTimeout: 2000000,
        readTimeout: 500000,
        body: "data=" + data + "&signature=" + signature + "",
        contentType: "application/x-www-form-urlencoded"
      }).body
    );
    norseUtils.log("cart status " + result.status);
    if (result && result.status && result.status === "success") {
      norseUtils.log("cart is paid");
      cart.transactionDate = new Date();
      cart.status = "paid";
      cart = checkoutHelper.checkoutCart(cart);
    } else if (
      result &&
      result.status &&
      (result.status === "failure" || result.status === "error")
    ) {
      norseUtils.log("updating status");
      cartLib.modifyCartWithParams(carts[i]._id, { status: "failed" });
    }
  }
}

function checkInterkassaOrderStatus() {
  var carts = cartLib.getPendingLiqpayCarts("interkassa");
  norseUtils.log(carts.length + " total interkassa pending carts found.");
  for (var i = 0; i < carts.length; i++) {
    norseUtils.log("fixing cart " + carts[i].userId);
    var result = JSON.parse(
      httpClientLib.request({
        url: "https://api.interkassa.com/v1/co-invoice/292835395",
        method: "GET",
        headers: {
          "Ik-Api-Account-Id": "5c1cb5253d1eaf58328b456c"
        },
        auth: {
          user: "5c1cb5073d1eafec2e8b456a",
          password: "nAxatKVfIXH1fbaIuW9pLcbjaR6vPfvN"
        }
      }).body
    );
    if (result.code !== 0) continue;
    let cart = carts[i];
    result = result.data;
    norseUtils.log("cart status " + result.state);
    if (result && result.state && result.state == "7") {
      norseUtils.log("cart is paid");
      cart.transactionDate = new Date();
      cart.status = "paid";
      cart = checkoutHelper.checkoutCart(cart);
    } else if (
      result &&
      result.state &&
      (result.state == "8" ||
        result.state == "9" ||
        result.state == "6" ||
        result.state == "5")
    ) {
      norseUtils.log("updating status");
      cartLib.modifyCartWithParams(carts[i]._id, { status: "failed" });
    }
  }
}
