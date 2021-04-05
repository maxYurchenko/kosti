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
const moment = require("moment");
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
  var carts = cartLib.getLiqpayPendingCarts();
  norseUtils.log(carts.length + " total liqpay pending carts found.");
  for (var i = 0; i < carts.length; i++) {
    let cart = carts[i];
    const result = getStatus(cart);
    norseUtils.log("fixing cart " + carts[i].userId);
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
  function getStatus(cart) {
    var data = hashLib.generateLiqpayData(getLiqpayStatusData(cart));
    var signature = hashLib.generateLiqpaySignature(data);
    return JSON.parse(
      httpClientLib.request({
        url: "https://www.liqpay.ua/api/request",
        method: "POST",
        body: "data=" + data + "&signature=" + signature + "",
        contentType: "application/x-www-form-urlencoded"
      }).body
    );
  }
}

function checkInterkassaOrderStatus() {
  let start = new Date();
  start.setTime(start.getTime() - 3 * 24 * 60 * 60 * 1000);
  let end = new Date();
  end.setTime(end.getTime() + 2 * 24 * 60 * 60 * 1000);
  start = moment(start).format("YYYY-MM-DD");
  end = moment(end).format("YYYY-MM-DD");
  const response = JSON.parse(
    httpClientLib.request({
      url:
        "https://api.interkassa.com/v1/co-invoice?fromDate=" +
        start +
        "&toDate=" +
        end,
      method: "GET",
      headers: {
        "Ik-Api-Account-Id": "5c1cb5253d1eaf58328b456c"
      },
      auth: {
        user: app.config.interkassaAPIuser,
        password: app.config.interkassaAPIpassword
      }
    }).body
  );
  norseUtils.log("got response from interkassa status " + response.code);
  if (response && response.code === 0) {
    processResponse();
  }

  function processResponse() {
    const orders = response.data;
    for (let order in orders) {
      if (orders[order].coId != app.config.interkassaID) {
        continue;
      }
      const id = orders[order].paymentNo.replace("ID_", "");
      norseUtils.log("checking cart id " + id);
      let carts = cartLib.getCartByUserId(id);
      if (carts.length < 1) {
        norseUtils.log("carts not found");
      }
      for (let i = 0; i < carts.length; i++) {
        let cart = carts[i];
        if (cart.status == "paid" || cart.status == "failed") {
          continue;
        }
        if ("ID_" + cart.userId != orders[order].paymentNo) {
          norseUtils.log("cart id does not match " + cart._id);
          continue;
        }
        if (orders[order].state == "7") {
          norseUtils.log("cart is paid");
          cart.transactionDate = new Date();
          cart.status = "paid";
          cart = checkoutHelper.checkoutCart(cart);
        } else if (
          orders[order].state == "8" ||
          orders[order].state == "9" ||
          orders[order].state == "6" ||
          orders[order].state == "5"
        ) {
          norseUtils.log("cart is failed");
          cartLib.modifyCartWithParams(carts[i]._id, { status: "failed" });
        } else {
          norseUtils.log("cart is still pending");
        }
      }
    }
  }
}
