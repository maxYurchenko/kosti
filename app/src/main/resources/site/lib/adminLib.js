var norseUtils = require("norseUtils");
var contentLib = require("/lib/xp/content");
var userLib = require("/lib/userLib");

exports.validateUserAdmin = validateUserAdmin;

function validateUserAdmin() {
  let user = userLib.getCurrentUser();
  if (user && user.data.roles.admin) {
    return true;
  }
  return false;
}
