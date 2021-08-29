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
    let festival = festivalLib.getActiveFestival();
    let games = playerLib.getGames({
      day: req.params.dayId,
      system: req.params.system,
      theme: req.params.theme,
      count: 9,
      parent: content._id
    });
    let filters = cache.api.getOnly("festival-filters");
    if (!filters) {
      filters = getFilters();
      cache.api.put("festival-filters", filters);
    }
    let mygamesLink = null;
    if (user)
      mygamesLink = portal.pageUrl({
        id: user.content._id,
        params: { action: "games" }
      });

    var model = {
      content: content,
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
        user: user
      }),
      festival: festival,
      filters: getFilters(),
      site: portal.getSite(),
      pageComponents: helpers.getPageComponents(req, "festival")
    };

    model.pageComponents["modal"] = thymeleaf.render(
      resolve("../components/modal.html"),
      {}
    );

    model.pageComponents["festivalHeader"] = thymeleaf.render(
      resolve("../../pages/components/header/festivalHeader.html"),
      {
        headerUser: thymeleaf.render(
          resolve("../../pages/components/header/headerUser.html"),
          {
            user: user
          }
        ),
        site: portal.getSite()
      }
    );

    return model;
  }

  function getFilters() {
    let filters = { themes: [], system: [] };
    let festival = festivalLib.getActiveFestival();
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
