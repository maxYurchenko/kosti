const httpClient = require("/lib/http-client");
const contentLib = require("/lib/xp/content");
const portalLib = require("/lib/xp/portal");
const i18nLib = require("/lib/xp/i18n");

const norseUtils = require("norseUtils");
const userLib = require("userLib");
const contextLib = require("contextLib");
const cartLib = require("cartLib");
const sharedLib = require("sharedLib");
const cacheLib = require("cacheLib");
const moment = require("moment");

const apiUrl = "https://api.novaposhta.ua/v2.0/json/";
const apiKey = "eaee91bea007e737a2c35aa94af39a32";

exports.makeRequest = makeRequest;
exports.getCity = getCity;
exports.createCounterparty = createCounterparty;
exports.getInternetDocumentData = getInternetDocumentData;

function makeRequest(model, calledMethod, params) {
  const data = {
    apiKey: apiKey,
    modelName: model,
    calledMethod: calledMethod,
    methodProperties: params
  };
  const response = JSON.parse(
    httpClient.request({
      url: apiUrl,
      method: "POST",
      body: JSON.stringify(data),
      contentType: "application/json"
    }).body
  );
  if (response.success) {
    return response.data;
  }
  return response;
  throw new NovaPoshtaException(
    "An Error happened during request to Novaposhta API"
  );
}

function getCity(name) {
  const cities = makeRequest("Address", "getCities", { FindByString: name });
  if (cities.length === 1) {
    return cities[0];
  }
  throw new NovaPoshtaException(
    "More then one city found. Manual order creation required."
  );
}

function createCounterparty(cart, property, type) {
  if (!property) {
    property = "Recipient";
  }
  if (!type) {
    type = "PrivatePerson";
  }
  const counterparty = makeRequest("Counterparty", "save", {
    LastName: sharedLib.transliterateToCyrillic(cart.name),
    FirstName: sharedLib.transliterateToCyrillic(cart.surname),
    Phone: cart.phone,
    Email: cart.email,
    CounterpartyType: type,
    CounterpartyProperty: property
  });
  if (counterparty && counterparty[0]) return counterparty[0];
  throw new NovaPoshtaException("Can not create counterparty");
}

function getExistingCounterparty() {
  const counterparty = makeRequest("Counterparty", "getCounterparties", {
    CounterpartyProperty: "Sender"
  });
  if (counterparty && counterparty[0]) return counterparty[0];
  throw new NovaPoshtaException("Can not get sender profile");
}

function getConterpatyContactPersons(id) {
  const counterparty = makeRequest(
    "Counterparty",
    "getCounterpartyContactPersons",
    {
      Ref: id
    }
  );
  if (counterparty && counterparty[0]) return counterparty[0];
  throw new NovaPoshtaException("Can not find sender contact");
}

function getInternetDocumentData(cart) {
  const senderPhone = "0662098750";
  const recipientCity = getCity(sharedLib.transliterateToCyrillic(cart.city));
  const recipient = createCounterparty(cart);
  const senderCity = getCity("Ужгород");
  const sender = getExistingCounterparty();
  const senderContact = getConterpatyContactPersons(sender.Ref);
  return {
    PayerType: "Sender",
    PaymentMethod: "Cash",
    CargoType: "Parcel",
    VolumeGeneral: "0.0015",
    Weight: cart.itemsWeight,
    ServiceType: "WarehouseWarehouse",
    SeatsAmount: "1",
    Description: "одежда",
    Cost: "1000",
    CitySender: senderCity.Ref,
    Sender: sender.Ref,
    SenderAddress: "5a39e538-e1c2-11e3-8c4a-0050568002cf",
    SendersPhone: senderPhone,
    ContactSender: senderContact.Ref,
    CityRecipient: recipientCity.Ref,
    Recipient: recipient.Ref,
    RecipientName: cart.name + " " + cart.surname,
    RecipientType: "PrivatePerson",
    RecipientAddress: cart.novaPoshtaWarehouseId,
    RecipientsPhone: cart.phone,
    ContactRecipient: recipient.ContactPerson.data[0].Ref,
    DateTime: moment().format("DD.MM.YYYY")
  };
}

function NovaPoshtaException(message) {
  this.message = message;
  this.name = "Ошибка";
}
