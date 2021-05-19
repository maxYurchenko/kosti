var thymeleaf = require("/lib/thymeleaf");
var portal = require("/lib/xp/portal");

var libLocation = "/site/lib/";
var norseUtils = require(libLocation + "norseUtils");
var userLib = require("/lib/userLib");

exports.post = function (req) {
  let user = userLib.fbRegister(req.params.token, req.params.userId);
  if (user) {
    user.authenticated = true;
    user.exist = true;
  }
  return {
    body: user,
    contentType: "application/json"
  };
};
