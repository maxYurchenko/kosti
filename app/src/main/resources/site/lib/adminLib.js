var norseUtils = require("norseUtils");
var contentLib = require("/lib/xp/content");
var userLib = require("userLib");

exports.validateUserAdmin = validateUserAdmin;

function validateUserAdmin() {
  let user = userLib.getCurrentUser();
  if (user && user.roles && user.roles.admin) {
    return true;
  }
  return false;
}
