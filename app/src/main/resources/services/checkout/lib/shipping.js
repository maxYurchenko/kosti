const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const cartLib = require("/lib/cartLib");

exports.getShipping = getShipping;
exports.getShippingById = getShippingById;

function getShipping(country, weight) {
  if (parseFloat(weight) === 0) {
    return [
      {
        id: "digital",
        title: "Доставка",
        price: 0,
        terms: ""
      }
    ];
  }
  var site = portal.getSiteConfig();
  var shipping = contentLib.get({ key: site.shipping });
  var result = [];
  shipping.data.shipping = norseUtils.forceArray(shipping.data.shipping);
  for (var i = 0; i < shipping.data.shipping.length; i++) {
    if (shipping.data.shipping[i].country.indexOf(country) != -1) {
      result = getShippingsWithPrices(
        shipping.data.shipping[i],
        country,
        weight
      );
    }
  }
  return result;
}

function getShippingsWithPrices(shipping, country, weight) {
  var result = [];
  shipping.methods = norseUtils.forceArray(shipping.methods);
  for (var j = 0; j < shipping.methods.length; j++) {
    var price = cartLib.getShippingPrice({
      country: country,
      itemsWeight: weight,
      shipping: shipping.methods[j].id
    });
    result.push({
      id: shipping.methods[j].id,
      title: shipping.methods[j].title,
      price: price.toFixed(),
      terms: shipping.methods[j].terms
    });
  }
  return result;
}

function getShippingById(shipping, id) {
  for (var i = 0; i < shipping.length; i++) {
    if (shipping[i].id == id) {
      return shipping[i];
    }
  }
}
