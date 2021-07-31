const httpClientLib = require("/lib/http-client");
const thymeleaf = require("/lib/thymeleaf");

const libLocation = "/site/lib/";
const norseUtils = require(libLocation + "norseUtils");
const adminLib = require(libLocation + "adminLib");
const moment = require(libLocation + "moment");

exports.getDonations = getDonations;
exports.beautifyDonations = beautifyDonations;

exports.get = function (req) {
  return {
    body: createModel(),
    contentType: "application/json"
  };

  function createModel() {
    if (!adminLib.validateUserAdmin()) {
      return { success: false };
    }
    const donations = getDonations(req.params.skip);
    if (donations.status === "success") {
      return {
        success: true,
        data: thymeleaf.render(resolve("/admin/donatepay/donations.html"), {
          donations: beautifyDonations(donations)
        })
      };
    }
    return { success: false, message: donations.message };
  }
};

function getDonations(skip) {
  if (!skip) skip = "";
  const url =
    "https://donatepay.ru/api/v1/transactions" +
    "?access_token=" +
    app.config.donatePayToken +
    "&skip=" +
    skip +
    "&type=donation&status=success&limit=50";
  let response = httpClientLib.request({
    url: url,
    method: "GET"
  });
  return JSON.parse(response.body);
}

function beautifyDonations(donations) {
  if (!donations.data) return donations;
  donations.data.forEach((d) => {
    d.date = moment(d.created_at).format("DD.MM.YYYY HH:mm:ss");
  });
  return donations;
}
