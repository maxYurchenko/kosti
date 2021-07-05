const thymeleaf = require("/lib/thymeleaf");
const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");

const userLib = require("/lib/userLib");
const festivalLib = require("/lib/festival/festivalLib");

const libLocation = "../../lib/";
const norseUtils = require(libLocation + "norseUtils");
const helpers = require(libLocation + "helpers");

exports.get = handleReq;

function handleReq(req) {
  function renderView() {
    return {
      body: thymeleaf.render(resolve("game.html"), createModel()),
      contentType: "text/html",
      pageContributions: {
        bodyEnd: [
          "<script src='" +
            portal.assetUrl({ path: "js/festivalGame.js" }) +
            "'></script>"
        ]
      }
    };
  }

  function createModel() {
    let user = userLib.getCurrentUser();
    let game = portal.getContent();
    game = festivalLib.beautifyGame(game);
    let discordUrl = null;
    if (!(user && user.content.data && user.content.data.discord)) {
      discordUrl = helpers.getDiscordUrl("api/festival/discord");
    }
    if (!game.content.data.players) game.content.data.players = [];
    game.content.data.players = norseUtils.forceArray(
      game.content.data.players
    );
    let gameSigned =
      user &&
      game &&
      game.content.data &&
      game.content.data.players &&
      game.content.data.players.indexOf(user.content._id) > -1;

    var model = {
      game: game,
      user: user,
      gameSigned: gameSigned,
      discordUrl: discordUrl,
      pageComponents: helpers.getPageComponents(req, "footerScripts")
    };

    return model;
  }

  return renderView();
}
