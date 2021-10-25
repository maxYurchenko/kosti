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
    let festival = festivalLib.getFestivalByChild(game._id);
    let userPath = user.content._path;
    userPath = userPath.split("/");
    userPath.splice(0, 2);
    userPath = "/" + userPath.join("/");

    var model = {
      game: game,
      spaceAvailable:
        game.processed.seatsReserved < game.content.data.maxPlayers,
      user: user,
      gameSigned: gameSigned,
      discordUrl: discordUrl,
      gamesListPage: portal.pageUrl({ id: festival.data.gamesListPage }),
      pageComponents: helpers.getPageComponents(req, "festival")
    };
    let siteConfig = portal.getSiteConfig();

    model.pageComponents["festivalHeader"] = thymeleaf.render(
      resolve("../../pages/components/header/festivalHeader.html"),
      {
        headerUser: thymeleaf.render(
          resolve("../../pages/components/header/festivalUser.html"),
          {
            user: user,
            kostirpgUrl: app.config["base.url"],
            userPath: userPath
          }
        ),
        logo: siteConfig.cityLogo
          ? norseUtils.getImage(siteConfig.cityLogo).url
          : portal.assetUrl({ path: "images/kosticonnect/headline.svg" }),
        site: portal.getSite(),
        kostirpgUrl: app.config["base.url"],
        logoUrl: portal.pageUrl({ id: siteConfig.festivalLanding })
      }
    );

    return model;
  }

  return renderView();
}
