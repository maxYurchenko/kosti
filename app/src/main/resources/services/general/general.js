var libLocation = "../../site/lib/";
var norseUtils = require(libLocation + "norseUtils");
var helpers = require(libLocation + "helpers");
var votesLib = require(libLocation + "votesLib");
var cartLib = require(libLocation + "cartLib");

exports.get = function(req) {
  var params = req.params;
  switch (params.action) {
    case "fixPermissions":
      helpers.fixPermissions(params.repo);
      break;
    case "fixVotesTimestamps":
      votesLib.fixVotesTimestamps();
      break;
    case "fixCartDate":
      cartLib.fixCartDate();
      break;
    case "fixCartPrice":
      cartLib.fixCartPrice();
      break;
  }
  return {
    body: "",
    contentType: "text/html"
  };
};
