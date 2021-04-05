const cronLib = require("/lib/cron");

const libLocation = "/site/lib/";
const helpers = require(libLocation + "helpers");
const norseUtils = require(libLocation + "norseUtils");
const cronsConfig = require(libLocation + "misc/crons");

exports.startCrons = startCrons;

function startCrons() {
  const crons = cronsConfig.crons;
  crons.forEach((cron) => {
    cronLib.schedule(cron);
  });
}
