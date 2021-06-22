const gmLib = require("/lib/festival/gmLib");

exports.post = function (req) {
  if (!req.params.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  var data = JSON.parse(req.params.data);

  return {
    body: gmLib.deleteGame(data.id),
    contentType: "application/json"
  };
};
