const norseUtils = require("../norseUtils");
const contentLib = require("/lib/xp/content");
const portalLib = require("/lib/xp/portal");
const nodeLib = require("/lib/xp/node");
const contextLib = require("../contextLib");
const userLib = require("../userLib");
const common = require("/lib/xp/common");
const thymeleaf = require("/lib/thymeleaf");
const util = require("/lib/util");
const cacheLib = require("../cacheLib");
const i18nLib = require("/lib/xp/i18n");

const festivalCache = cacheLib.api.createGlobalCache({
  name: "festival",
  size: 10000,
  expire: 60 * 60 * 24
});

exports.getTablesStartNum = getTablesStartNum;

function getTablesStartNum(gameId) {
  let block = util.content.getParent({ key: gameId });
  let blockNumber = null;
  let tables = 0;
  if (block && block.data && block.data.blockNumber) {
    blockNumber = parseInt(block.data.blockNumber);
  }
  blockNumber && blockNumber % 2 === 1 ? (tables = 1) : (tables = 20);
  return tables;
}
