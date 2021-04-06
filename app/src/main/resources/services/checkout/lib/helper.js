const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const contextLib = require(libLocation + "contextLib");
const norseUtils = require(libLocation + "norseUtils");
const cartLib = require(libLocation + "cartLib");
const promosLib = require(libLocation + "promosLib");
const mailsLib = require(libLocation + "mailsLib");
const storeLib = require(libLocation + "storeLib");
const helpers = require(libLocation + "helpers");
const sharedLib = require(libLocation + "sharedLib");

exports.checkoutCart = checkoutCart;
exports.sendConfirmationMail = sendConfirmationMail;
exports.validateCartForCheckout = validateCartForCheckout;
exports.getCheckoutMainModel = getCheckoutMainModel;

function checkoutCart(cart) {
  return contextLib.runAsAdmin(function () {
    cartLib.modifyInventory(cart.items);
    cartLib.modifyCartWithParams(cart._id, {
      status: cart.status,
      transactionDate: cart.transactionDate,
      transactionPrice: cart.price,
      ik_inv_id: cart.ik_inv_id
    });
    cartLib.savePrices(cart._id);
    if (cart.promos) {
      promosLib.reduceUsePromos(cart.promos);
    }
    cart = cartLib.getCart(cart._id);
    sendConfirmationMail(cart);
    if (cart.status === "pending") {
      return cartLib.getCart(cart._id);
    } else {
      return cartLib.generateItemsIds(cart._id);
    }
  });
}

function sendConfirmationMail(cart) {
  if (cart.status === "paid") {
    mailsLib.sendMail("orderCreated", cart.email, {
      cart: cart
    });
  } else {
    mailsLib.sendMail(
      "pendingItem",
      ["maxskywalker94@gmail.com", "demura.vi@gmail.com"],
      {
        id: cart._id,
        userId: cart.userId
      }
    );
  }
}

function validateCartForCheckout(cart) {
  if (
    !cart.items ||
    cart.items.length === 0 ||
    !cart.status ||
    !cart.userId ||
    !cart.price
  ) {
    return false;
  }
  return true;
}

function getCheckoutMainModel(req) {
  let cart = cartLib.getCart(req.cookies.cartId);
  for (let i = 0; i < cart.items.length; i++) {
    cart.items[i].priceBlock = storeLib.getPriceBlock(cart.items[i]);
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
