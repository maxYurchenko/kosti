var libLocation = "/site/lib/";
var norseUtils = require(libLocation + "norseUtils");

exports.responseProcessor = function (req, res) {
  if (req && req.headers && req.headers.Cookie) {
    const sessionCookieAmount = (req.headers.Cookie.match(/JSESSIONID/g) || [])
      .length;
    if (req.cookies.JSESSIONID && sessionCookieAmount === 1)
      res.cookies = {
        JSESSIONID: {
          value: req.cookies.JSESSIONID,
          path: "/",
          secure: false,
          httpOnly: true,
          domain: "." + app.config.baseHost
        }
      };
  }
  return res;
};
