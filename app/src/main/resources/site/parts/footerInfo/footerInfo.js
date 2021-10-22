const portal = require("/lib/xp/portal");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");

const libLocation = "../../lib/";
const norseUtils = require(libLocation + "norseUtils");

exports.get = function (req) {
  return {
    body: thymeleaf.render(resolve("footerInfo.html"), getModel()),
    contentType: "text/html"
  };

  function getModel() {
    const component = portal.getComponent();
    const config = component.config;
    let blockOne = {
      image: norseUtils.getImage(config.blockOne.image),
      info: config.blockOne.info,
      links: config.blockOne.links
        ? norseUtils.forceArray(config.blockOne.links)
        : null
    };
    let blockTwo = {
      info: config.blockTwo.info,
      links: config.blockTwo.links
        ? norseUtils.forceArray(config.blockTwo.links)
        : null
    };
    let blockThree = {
      url: config.blockThree.url
    };
    norseUtils.log(config.blockThree);
    return { blockOne, blockTwo, blockThree, mirrored: config.mirrored };
  }
};
