var thymeleaf = require("/lib/thymeleaf");
var authLib = require("/lib/xp/auth");
var libs = {
  context: require("/lib/xp/context")
};

var libLocation = "../../lib/";
var portal = require("/lib/xp/portal");
var contentLib = require("/lib/xp/content");
var norseUtils = require(libLocation + "norseUtils");
var helpers = require(libLocation + "helpers");
var userLib = require(libLocation + "userLib");
var spellLib = require(libLocation + "spellsLib");
var contextLib = require(libLocation + "contextLib");

exports.get = handleReq;

function handleReq(req) {
  var me = this;

  function renderView() {
    var view = resolve("monster.html");
    var model = createModel();
    var body = thymeleaf.render(view, model);
    var fileName = portal.assetUrl({ path: "js/monster.js" });
    return {
      body: body,
      contentType: "text/html",
      pageContributions: {
        bodyEnd: ["<script src='" + fileName + "'></script>"]
      }
    };
  }

  function createModel() {
    var up = req.params;
    var content = contextLib.runInDraftAsAdmin(function () {
      return portal.getContent();
    });
    content.data.actions = norseUtils.forceArray(content.data.actions);
    content.data.reactions = norseUtils.forceArray(content.data.reactions);
    content.data.legendaryActions = norseUtils.forceArray(
      content.data.legendaryActions
    );
    content.data.specialAbilities = norseUtils.forceArray(
      content.data.specialAbilities
    );
    var contentType = contentLib.getType(app.name + ":monster");
    var inputs = {
      alignment: null,
      sizes: null,
      typeOptions: null,
      stats: [],
      savethrow: [],
      misc: [],
      type: [],
      hp: [],
      damageImmune: [],
      skills: [],
      speed: [],
      actions: [],
      specialAbilities: [],
      reactions: [],
      legendaryActions: []
    };
    for (var i = 0; i < contentType.form.length; i++) {
      var item = contentType.form[i];
      var itemDisplay =
        item && item.config && item.config.display && item.config.display[0]
          ? item.config && item.config.display && item.config.display[0]
          : null;
      if (item.name === "alignment") {
        inputs.alignment = item.config.option;
      } else if (item.name === "type") {
        inputs.typeOptions = item.config.option;
      } else if (item.name === "size") {
        inputs.sizes = item.config.option;
      } else if (item.name === "skills" || item.name === "speed") {
        for (var j = 0; j < item.items.length; j++) {
          var tempItem = item.items[j];
          tempItem.display =
            tempItem &&
            tempItem.config &&
            tempItem.config.display &&
            tempItem.config.display[0]
              ? tempItem.config &&
                tempItem.config.display &&
                tempItem.config.display[0]
              : null;
          inputs[item.name].push(prepareInput(tempItem));
        }
      } else if (
        [
          "actions",
          "legendaryActions",
          "reactions",
          "specialAbilities"
        ].indexOf(item.name) !== -1
      ) {
        inputs[item.name] = prepareActions(content.data[item.name]);
      } else if (itemDisplay && itemDisplay["@group"]) {
        item.display = itemDisplay;
        inputs[itemDisplay["@group"]].push(prepareInput(item));
      }
    }

    var model = {
      content: content,
      app: app,
      inputs: inputs,
      pageComponents: helpers.getPageComponents(req)
    };

    return model;

    //TODO move current functions to a library to use from different places
    function prepareInput(input) {
      delete input.occurrences;
      delete item.maximize;
      delete item.config;
      return input;
    }

    function prepareActions(actions) {
      if (!actions) {
        return "";
      }
      var result = [];
      var view = resolve("../components/form/action.html");
      actions = norseUtils.forceArray(actions);
      for (var i = 0; i < actions.length; i++) {
        result.push(
          thymeleaf.render(view, {
            name: actions[i].name,
            description: actions[i].desc
          })
        );
      }
      return result;
    }
  }

  return renderView();
}
