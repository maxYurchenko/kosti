const portal = require("/lib/xp/portal");
const thymeleaf = require("/lib/thymeleaf");
const contentLib = require("/lib/xp/content");

const libLocation = "../../lib/";
const norseUtils = require(libLocation + "norseUtils");

exports.get = function (req) {
  return {
    body: thymeleaf.render(resolve("infoWithImage.html"), getModel()),
    contentType: "text/html"
  };

  function getModel() {
    const component = portal.getComponent();
    const config = component.config;
    return {
      image: norseUtils.getImage(config.image),
      info: config.info,
      mirrored: config.mirrored,
      background: config.background
    };
  }
};
