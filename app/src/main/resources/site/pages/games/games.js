const thymeleaf = require("/lib/thymeleaf");
const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");

const festivalLib = require("/lib/festival/festivalLib");
const playerLib = require("/lib/festival/playerLib");
const userLib = require("/lib/userLib");

const libLocation = "../../lib/";
const norseUtils = require(libLocation + "norseUtils");
const helpers = require(libLocation + "helpers");
const cacheLib = require(libLocation + "cacheLib");

const cache = cacheLib.api.createGlobalCache({
  name: "festival",
  size: 1000,
  expire: 60 * 60 * 24
});

exports.get = handleReq;

function handleReq(req) {
  let user = userLib.getCurrentUser();
  if (
    user &&
    user.roles &&
    user.roles.moderator &&
    req.params.cache === "clear"
  ) {
    cache.api.clear();
  }

  function renderView() {
    var view = resolve("games.html");
    var model = createModel();
    var body = thymeleaf.render(view, model);
    return {
      body: thymeleaf.render(resolve("games.html"), createModel()),
      contentType: "text/html",
      pageContributions: {
        bodyEnd: [
          "<script src='" +
            portal.assetUrl({ path: "js/festivalGame.js" }) +
            "'></script>",
          "<script src='" +
            portal.assetUrl({ path: "js/gamesList.js" }) +
            "'></script>",
          "<script src='" +
            portal.assetUrl({ path: "js/festivalAdmin.js" }) +
            "'></script>"
        ]
      }
    };
  }

  function createModel() {
    let user = userLib.getCurrentUser();
    let content = portal.getContent();
    let festival = festivalLib.getFestivalByChild(content._id);
    let games = playerLib.getGames({
      day: req.params.dayId,
      system: req.params.system,
      theme: req.params.theme,
      count: 9,
      parent: content._id
    });
    let mygamesLink = null;
    let userPath = helpers.getFestivalUserUrl(user);
    if (userPath) {
      mygamesLink = userPath + "?action=games";
    }
    let filters = cache.api.getOnly("festival-filters");
    if (!filters) {
      filters = getFilters();
      cache.api.put("festival-filters", filters);
    }
    let currentBlock =
      games.length > 0
        ? games[games.length - 1].processed.block.content._id
        : null;
    let currentDay =
      games.length > 0
        ? games[games.length - 1].processed.day.content._id
        : null;

    var model = {
      content: content,
      kostirpgUrl: app.config["base.url"],
      user: user,
      mygamesLink: mygamesLink,
      days: festivalLib.getItemsList({
        parentId: festival._id,
        type: "block",
        parentPathLike: true,
        additionalQuery: " and data.blockType='day'"
      }),
      gamesView: thymeleaf.render(resolve("gamesBlock.html"), {
        games: games,
        user: user,
        cityBoss: userLib.checkCurrentUserCityBoss(festival.data.bossRole)
      }),
      festival: festival,
      filters: getFilters(),
      site: portal.getSite(),
      currentDay: currentDay,
      currentBlock: currentBlock,
      pageComponents: helpers.getPageComponents(req, "festival")
    };

    model.pageComponents["modal"] = thymeleaf.render(
      resolve("../components/modal.html"),
      {}
    );
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

  function getFilters() {
    let content = portal.getContent();
    let filters = { themes: [], system: [] };
    let festival = festivalLib.getFestivalByChild(content._id);
    let games = festivalLib.getItemsList({
      parentId: festival._id,
      type: "game",
      parentPathLike: true
    });
    games.forEach((game) => {
      if (game.data.theme && filters.themes.indexOf(game.data.theme) === -1)
        filters.themes.push(game.data.theme);
      if (
        game.data.gameSystem &&
        game.data.gameSystem.select &&
        game.data.gameSystem.select.system &&
        filters.system.indexOf(game.data.gameSystem.select.system) === -1
      )
        filters.system.push(game.data.gameSystem.select.system);
    });
    return filters;
  }

  return renderView();
}
