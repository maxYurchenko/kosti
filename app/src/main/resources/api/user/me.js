const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");

const libLocation = "../../site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const userLib = require(libLocation + "userLib");
const helpers = require(libLocation + "helpers");

exports.get = function (req) {
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