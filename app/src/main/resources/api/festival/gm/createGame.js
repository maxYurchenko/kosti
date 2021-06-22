const gmLib = require("/lib/festival/gmLib");

exports.post = function (req) {
  if (!req.params.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  let data = JSON.parse(req.params.data);
  let displayName = data.displayName;
  delete data.displayName;
  return {
    body: gmLib.addGame(displayName ? displayName : "", data),
    contentType: "application/json"
  };
};
