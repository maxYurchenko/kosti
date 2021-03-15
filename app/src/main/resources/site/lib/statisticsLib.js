var norseUtils = require("norseUtils");
var contentLib = require("/lib/xp/content");
var portalLib = require("/lib/xp/portal");
var cartLib = require("cartLib");

exports.getCarts = getCarts;
exports.calculateCartPrices = calculateCartPrices;
exports.getStatisticsPerItem = getStatisticsPerItem;
exports.getStatisticsPerCountry = getStatisticsPerCountry;
exports.getUniqueBuyersAmount = getUniqueBuyersAmount;

function getCarts(params) {
  let carts = cartLib.getCreatedCarts({ status: "paid" });
  return carts;
}

function calculateCartPrices(carts) {
  if (!carts) return null;
  let result = { total: 0, itemsPrice: 0, shipping: 0 };
  carts = norseUtils.forceArray(carts);
  carts.forEach((cart) => {
    if (cart && cart.price) {
      result.total += parseInt(cart.price.total);
      result.itemsPrice += parseInt(cart.price.items);
      result.shipping += parseInt(cart.price.shipping);
    }
  });
  result.averageTotal = result.total / carts.length;
  result.averageShipping = result.shipping / carts.length;
  result.averageItemsPrice = result.itemsPrice / carts.length;
  return result;
}

function getStatisticsPerItem(carts) {
  if (!carts) return null;
  let resultObj = {};
  carts = norseUtils.forceArray(carts);
  carts.forEach((cart) => {
    cart.items.forEach((item) => {
      if (resultObj[item._id]) {
        resultObj[item._id].amount += parseInt(item.amount);
      } else {
        let temp = contentLib.get({ key: item._id });
        resultObj[item._id] = {
          amount: parseInt(item.amount),
          displayName: temp.displayName
        };
      }
    });
  });
  return convertToArray(resultObj);
}

function getStatisticsPerCountry(carts) {
  if (!carts) return null;
  let result = {};
  carts = norseUtils.forceArray(carts);
  carts.forEach((cart) => {
    if (!result[cart.country])
      result[cart.country] = { amount: 0, displayName: cart.country };
    result[cart.country].amount++;
  });
  return convertToArray(result);
}

function getUniqueBuyersAmount(carts) {
  if (!carts) return null;
  let result = [];
  carts = norseUtils.forceArray(carts);
  carts.forEach((cart) => {
    if (result.indexOf(cart.email) === -1) result.push(cart.email);
  });
  return result;
}

function convertToArray(obj) {
  let result = [];
  for (let prop in obj) {
    result.push(obj[prop]);
  }

  result.sort(function (a, b) {
    if (a.amount < b.amount) {
      return 1;
    }
    if (a.amount > b.amount) {
      return -1;
    }
    return 0;
  });
  return result;
}
