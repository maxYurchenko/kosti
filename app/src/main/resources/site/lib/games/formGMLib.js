const norseUtils = require("../norseUtils");
const contentLib = require("/lib/xp/content");
const portalLib = require("/lib/xp/portal");
const nodeLib = require("/lib/xp/node");
const contextLib = require("../contextLib");
const userLib = require("../userLib");
const formSharedLib = require("formSharedLib");
const common = require("/lib/xp/common");
const util = require("/lib/util");
const i18nLib = require("/lib/xp/i18n");

exports.modifyGame = modifyGame;
exports.deleteGame = deleteGame;
exports.addGame = addGame;

function checkIfGameExists(data) {
  var gameBlock = contentLib.get({ key: data.blockId });
  var games = contentLib.query({
    query:
      "data.location = '" +
      data.location +
      "' and _parentPath = '/content" +
      gameBlock._path +
      "' and _name = '" +
      common.sanitize(data.displayName) +
      "'",
    start: 0,
    count: 0
  });
  if (games.total > 0) {
    return true;
  }
  return false;
}

function checkIfMasterBookedThisBlock(data) {
  var gameBlock = contentLib.get({ key: data.blockId });
  var user = userLib.getCurrentUser();
  var games = contentLib.query({
    query:
      "data.location = '" +
      data.location +
      "' and _parentPath = '/content" +
      gameBlock._path +
      "' and data.master = '" +
      user._id +
      "'",
    start: 0,
    count: 0
  });
  if (games.total > 0) {
    return true;
  }
  return false;
}

function deleteGame(id) {
  contentLib.delete({
    key: id
  });
  contextLib.runInDraft(function () {
    contentLib.delete({
      key: id
    });
  });
}

function modifyGame(data) {
  var user = userLib.getCurrentUser();
  data.master = user._id;
  delete data.blockId;
  var game = contentLib.modify({
    key: data._id,
    editor: editor
  });
  function editor(c) {
    c.displayName = data.displayName;
    data.location = c.data.location;
    delete data.displayName;
    delete data._id;
    c.data = data;
    return c;
  }
  var result = contentLib.publish({
    keys: [game._id],
    sourceBranch: "master",
    targetBranch: "draft"
  });
  return result;
}

function addGame(data) {
  if (
    formSharedLib.getLocationSpace(data.location, data.blockId).available < 1 ||
    checkIfGameExists(data)
  ) {
    return {
      error: true,
      message: i18nLib.localize({
        key: "myGames.form.message.noSpace"
      })
    };
  }
  if (checkIfMasterBookedThisBlock(data)) {
    return {
      error: true,
      message: i18nLib.localize({
        key: "myGames.form.message.alreadyBooked"
      })
    };
  }
  var day = util.content.getParent({ key: data.location });
  var game = contextLib.runAsAdminAsUser(userLib.getCurrentUser(), function () {
    var parent = contentLib.get({ key: data.blockId });
    var displayName = data.displayName;
    delete data.displayName;
    delete data.blockId;
    var user = userLib.getCurrentUser();
    if (!user.data.firstName) {
      userLib.editUser({ firstName: data.masterName, id: user._id });
    }
    data.master = user._id;
    var game = contentLib.create({
      name: common.sanitize(displayName),
      parentPath: parent._path,
      displayName: displayName,
      contentType: app.name + ":game",
      data: data
    });
    if (!game) {
      return {
        error: true,
        message: i18nLib.localize({
          key: "myGames.form.message.unableToCreate"
        })
      };
    }
    var result = contentLib.publish({
      keys: [game._id],
      sourceBranch: "master",
      targetBranch: "draft"
    });
    if (!result) {
      return {
        error: true,
        message: i18nLib.localize({
          key: "myGames.form.message.unableToPublish"
        })
      };
    }
    return game;
  });
  return {
    error: false,
    message: i18nLib.localize({
      key: "myGames.form.message.success"
    }),
    html: formSharedLib.getView("gmComp", null, { expanded: day._id })
  };
}
