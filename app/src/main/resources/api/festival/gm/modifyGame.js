const gmLib = require("/lib/festival/gmLib");
var libLocation = "/site/lib/";
var norseUtils = require(libLocation + "norseUtils");

exports.post = function (req) {
  if (!req.params.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  let data = JSON.parse(req.params.data);
  let displayName = data.displayName;
  let id = data._id;
  delete data.displayName;
  delete data._id;
  let game = { displayName: displayName, _id: id, data: data };
  return {
    body: gmLib.modifyGame(game),
    contentType: "application/json"
  };
};
