const norseUtils = require("norseUtils");
const contentLib = require("/lib/xp/content");
const portalLib = require("/lib/xp/portal");
const cartLib = require("cartLib");
const moment = require("moment");

exports.getCarts = getCarts;
exports.calculateCartPrices = calculateCartPrices;
exports.getStatisticsPerItem = getStatisticsPerItem;
exports.getStatisticsPerCountry = getStatisticsPerCountry;
exports.getUniqueBuyersAmount = getUniqueBuyersAmount;
exports.getFirstAndLastDayOfMonth = getFirstAndLastDayOfMonth;

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
  result.averageTotal = Math.floor(result.total / carts.length);
  result.averageShipping = Math.floor(result.shipping / carts.length);
  result.averageItemsPrice = Math.floor(result.itemsPrice / carts.length);
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

function getFirstAndLastDayOfMonth(params) {
  if (!params) params = {};
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  params.start = moment(new Date(y, m, 1)).format("YYYY-MM-DD");
  params.end = moment(new Date(y, m + 1, 0)).format("YYYY-MM-DD");
  return params;
}
