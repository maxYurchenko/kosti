var portal = require("/lib/xp/portal");

var libLocation = "/site/lib/";
var userLib = require("/lib/userLib");

exports.get = function (req) {
  if (req.params.code) {
    userLib.vkRegister(req.params.code, "me/vk");
  }
  const user = userLib.getCurrentUser();
  return {
    status: 302,
    headers: {
      Location: portal.pageUrl({
        path: user._path
      })
    }
  };
};
