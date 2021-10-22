const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");

exports.responseProcessor = function (req, res) {
  if (req && req.cookies && req.cookies.JSESSIONID) {
    res.cookies = {
      JSESSIONID: {
        value: req.cookies.JSESSIONID,
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "Lax",
        domain: "." + app.config.baseHost
      }
    };
  }
  return res;
};
