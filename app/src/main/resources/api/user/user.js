const userLib = require("/lib/userLib");
const playerLib = require("/lib/festival/playerLib");
const norseUtils = require("../../site/lib/norseUtils");

exports.post = function (req) {
  let message = null;
  if (req.params.kosticonnect2022) {
    if (!parseInt(req.params.kosticonnect2022)) {
      return {
        body: { error: true, message: "Не верный билет." },
        contentType: "application/json"
      };
    }
    const assingnedTicket = playerLib.assignTicket(req.params.kosticonnect2022);
    if (assingnedTicket.error) {
      return {
        body: assingnedTicket,
        contentType: "application/json"
      };
    }
    message = assingnedTicket.message;
  }
  return {
    body: {
      error: false,
      data: userLib.editUser(req.params),
      message: message
    },
    contentType: "application/json"
  };
};
