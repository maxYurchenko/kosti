const gmLib = require("/lib/festival/gmLib");
const formLib = require("/lib/festival/formLib");
const thymeleaf = require("/lib/thymeleaf");
const utils = require("/lib/util");

exports.post = function (req) {
  var result = {};
  var data = JSON.parse(req.params.data);
  var action = data.action;
  delete data.action;
  switch (action) {
    case "addGame":
      result = formGMLib.addGame(data);
      break;
    case "editGame":
      result = gmLib.modifyGame(data);
      break;
    case "deleteGame":
      result = gmLib.deleteGame(data.id);
      break;
    default:
      break;
  }
  return {
    body: result,
    contentType: "application/json"
  };
};

exports.get = function (req) {
  let html, model, json;
  let viewType = req.params.viewType;
  switch (viewType) {
    case "locationAndGameBlockComp":
      json = formLib.getViewModel(viewType, req.params.id);
      model = {
        locations: thymeleaf.render(resolve(views["locationComp"]), {
          locations: json.locations,
          festival: json.festival
        }),
        gameBlocks: thymeleaf.render(resolve(views["gameBlocksComp"]), {
          blocks: json.blocks,
          festival: json.festival
        }),
        festival: json.festival
      };
      html = thymeleaf.render(resolve(views[viewType]), model);
      break;
    case "gameBlocksComp":
      model = formLib.getViewModel(viewType, req.params.id);
      html = thymeleaf.render(resolve(views[viewType]), model);
      break;
    case "scheduleComp":
    case "gmComp":
      model = formLib.getViewModel(viewType, req.params.id);
      model.days.forEach((day) => {
        day.processed.available = thymeleaf.render(
          resolve("/site/pages/user/games/shared/availableComp.html"),
          {
            games: day.processed.games,
            festival: model.festival
          }
        );
      });
      html = thymeleaf.render(resolve(views[viewType]), model);
      utils.log(views[viewType]);
      break;
    case "addGameForm":
      model = formLib.getViewModel(viewType, req.params.id);
      html = thymeleaf.render(resolve(views[viewType]), model);
    default:
      break;
  }
  return {
    body: { html: html },
    contentType: "application/json"
  };
};

const baseUrl = "/site/pages/user/games/";

const views = {
  gmComp: baseUrl + "shared/scheduleComp.html",
  scheduleComp: baseUrl + "shared/scheduleComp.html",
  locationAndGameBlockComp: baseUrl + "gm/locationBlocksWrapper.html",
  availableComp: baseUrl + "shared/availableComp.html",
  addGameForm: baseUrl + "gm/addGameForm.html",
  locationComp: baseUrl + "shared/locationComp.html",
  gameBlocksComp: baseUrl + "gm/gameBlocksComp.html"
};
