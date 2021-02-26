var norseUtils = require("../site/lib/norseUtils");
var httpClient = require("/lib/http-client");

exports.run = function () {
  sendDiscordMessage();
};

function sendDiscordMessage(data) {
  httpClient.request({
    url:
      //"https://discord.com/api/webhooks/814906022229442570/VNEvsWZ8Zy_F4lF0Q8ZSSXhy9AUuwmtrUmVp88bnJWVojddramXX8ABekN5Bxaws2Umh",
      "https://discord.com/api/webhooks/814902364108357712/WgkqpL-Y6oBTR4Yo_0fNTG0hpl6axBzxl34LmuHwEtE000Z3ENzTQVPkaT-r-AmjUMWH",
    method: "POST",
    body: JSON.stringify({
      content: "тест"
    }),
    contentType: "application/json"
  });
  return {
    body: "",
    contentType: "text/html"
  };
}
