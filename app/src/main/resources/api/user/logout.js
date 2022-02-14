var userLib = require("/lib/userLib");
var portal = require("/lib/xp/portal");

exports.get = function () {
  userLib.logout();
  var site = portal.getSite();
  return {
    redirect: portal.pageUrl({ path: site._path })
  };
};
