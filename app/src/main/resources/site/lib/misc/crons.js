const blogLib = require("/site/lib/blogLib");
const checkoutLib = require("/site/lib/checkoutLib");
const homepageLib = require("/site/lib/homepageLib");
const storeLib = require("/site/lib/storeLib");
const httpClientLib = require("/lib/http-client");

const context = {
  repository: "com.enonic.cms.default",
  branch: "master",
  principals: ["role:system.admin"]
};

const auth = {
  user: "cronuser",
  password: app.config["cronuserpass"]
};

exports.crons = [
  {
    name: "updateSchedule",
    cron: "0 2 * * *",
    callback: function () {
      log.info("Updating schedule");
      blogLib.updateSchedule();
      log.info("Finished updating schedule");
    },
    context: context
  },
  {
    name: "checkOrdersStatus",
    cron: "*/15 * * * *",
    callback: function () {
      log.info("Checking orders");

      httpClientLib.request({
        url: app.config["base.url"] + "/api/cron/pendingcarts",
        method: "POST",
        auth: auth
      }).body;

      log.info("Finished updating orders");
    },
    context: context
  },
  {
    name: "regenerateCache",
    cron: "0 1 * * *",
    callback: function () {
      log.info("Regenerating cache");

      httpClientLib.request({
        url: app.config["base.url"] + "/api/cron/cache/regenerate",
        method: "POST",
        auth: auth
      }).body;
      log.info("Finished updating cache");
    },
    context: context
  },
  {
    name: "checkProductStock",
    cron: "15 * * * *",
    callback: function () {
      log.info("Updating product stock");
      storeLib.checkProductsStock();
      log.info("Finished updating product stock");
    },
    context: context
  }
];
