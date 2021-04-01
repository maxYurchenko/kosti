const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const thymeleaf = require("/lib/thymeleaf");
const cronLib = require("/lib/cron");

const libLocation = "/site/lib/";
const helpers = require(libLocation + "helpers");
const norseUtils = require(libLocation + "norseUtils");
const cronsConfig = require(libLocation + "misc/crons");
const adminLib = require(libLocation + "adminLib");

exports.get = function (req) {
  if (!adminLib.validateUserAdmin()) {
    return false;
  }
  const currentCrons = cronLib.list();
  currentCrons.jobs.forEach((cron) => {
    cronLib.unschedule({
      name: cron.name
    });
  });
  const crons = cronsConfig.crons;
  crons.forEach((cron) => {
    cronLib.schedule(cron);
  });
  return {
    body: thymeleaf.render(resolve("crons.html"), {
      pageComponents: helpers.getPageComponents(req),
      crons: cronLib.list()
    }),
    contentType: "text/html"
  };
};
