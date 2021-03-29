const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const contextLib = require("contextLib");
const norseUtils = require("norseUtils");
const helpers = require("helpers");
const cartLib = require("cartLib");
const mailsLib = require("mailsLib");
const sharedLib = require("sharedLib");
const promosLib = require("promosLib");
const storeLib = require("storeLib");

exports.checkIKResponse = checkIKResponse;
exports.getLiqpayData = getLiqpayData;
exports.getLiqpayStatusData = getLiqpayStatusData;
exports.getCartDescription = getCartDescription;
exports.checkLiqpayOrderStatus = checkLiqpayOrderStatus;
exports.getCheckoutMainModel = getCheckoutMainModel;

function getCheckoutMainModel(req) {
  var cart = cartLib.getCart(req.cookies.cartId);
  var site = portal.getSiteConfig();
  for (var i = 0; i < cart.items.length; i++) {
    cart.items[i].priceBlock = storeLib.getPriceBlock(cart.items[i]._id);
  }
  return {
    cart: cart,
    promos: thymeleaf.render(
      resolve("/services/checkout/templates/promos.html"),
      {
        promos: cart.price.discount.codes
      }
    ),
    ik_id: app.config.interkassaID,
    pageComponents: helpers.getPageComponents(
      req,
      "footerCheckout",
      null,
      "Оплата и доставка"
    ),
    promosUrl: sharedLib.generateNiceServiceUrl("promos")
  };
}

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

function checkIKResponse(params, model) {
  if (params.ik_inv_st == "success") {
    params.step = "success";
    cartLib.modifyCartWithParams(model.cart._id, {
      status: "paid",
      transactionDate: new Date(),
      price: model.cart.price
    });
    contextLib.runAsAdmin(function () {
      cartLib.savePrices(model.cart._id);
      cartLib.modifyInventory(model.cart.items);
      if (model.cart.promos) {
        promosLib.reduceUsePromos(model.cart.promos);
      }
    });
  } else if (params.ik_inv_st == "fail" || params.ik_inv_st == "canceled") {
    params.error = true;
    params.step = "3";
    cartLib.modifyCartWithParams(model.cart._id, { status: "failed" });
  } else if (params.ik_inv_st == "waitAccept") {
    params.step = "pending";
    contextLib.runAsAdmin(function () {
      cartLib.modifyInventory(model.cart.items);
      cartLib.savePrices(model.cart._id);
      cartLib.modifyCartWithParams(model.cart._id, {
        status: "pending",
        transactionDate: new Date(),
        price: model.cart.price
      });
    });
  }
  return params;
}

function checkLiqpayOrderStatus() {
  var carts = cartLib.getPendingLiqpayCarts();
  norseUtils.log(carts.length + " total pending carts found.");
  for (var i = 0; i < carts.length; i++) {
    norseUtils.log("fixing cart " + carts[i].userId);
    var data = hashLib.generateLiqpayData(
      checkoutLib.getLiqpayStatusData(carts[i])
    );
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
      checkoutLib.checkoutCart(carts[i], "paid");
      carts[i] = contextLib.runAsAdmin(function () {
        return (carts[i] = cartLib.generateItemsIds(carts[i]._id));
      });
      norseUtils.log("sending mail");
      mailsLib.sendMail("orderCreated", carts[i].email, {
        cart: carts[i]
      });
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
