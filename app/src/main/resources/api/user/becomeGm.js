var portal = require("/lib/xp/portal");
var contentLib = require("/lib/xp/content");
var thymeleaf = require("/lib/thymeleaf");
var httpClientLib = require("/lib/http-client");

var libLocation = "../../site/lib/";
var norseUtils = require(libLocation + "norseUtils");
var userLib = require("/lib/userLib");
var helpers = require(libLocation + "helpers");

exports.get = function (req) {
  if (req.params.code) {
    userLib.discordRegister(req.params.code, "become-gm");
  }
  var user = userLib.getCurrentUser();
  if (!user) {
    return helpers.getLoginRequest({
      redirect: "become-gm"
    });
  }
  userLib.addRole("gamemaster", user.user.key);
  return {
    status: 302,
    headers: {
      Location: portal.pageUrl({
        path: user.content._path,
        params: { action: "games" }
      })
    }
  };
};
