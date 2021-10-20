const portal = require("/lib/xp/portal");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");

const libLocation = "../../lib/";
const norseUtils = require(libLocation + "norseUtils");

exports.get = function (req) {
  return {
    body: thymeleaf.render(resolve("hero.html"), getModel()),
    contentType: "text/html"
  };

  function getModel() {
    const component = portal.getComponent();
    const config = component.config;
    const links = config.links ? norseUtils.forceArray(config.links) : null;
    return {
      links: links ? config.links : null,
      background: norseUtils.getImage(config.background),
      title: config.title
    };
  }
};
