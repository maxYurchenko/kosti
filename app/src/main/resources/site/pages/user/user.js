const thymeleaf = require("/lib/thymeleaf");
const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const valueLib = require("/lib/xp/value");

const playerLib = require("/lib/festival/playerLib");
const formLib = require("/lib/festival/formLib");
const cartLib = require("/lib/cartLib");
const userLib = require("/lib/userLib");

const libLocation = "../../lib/";
const norseUtils = require(libLocation + "norseUtils");
const moment = require(libLocation + "moment");
const votesLib = require(libLocation + "votesLib");
const sharedLib = require(libLocation + "sharedLib");
const blogLib = require(libLocation + "blogLib");
const helpers = require(libLocation + "helpers");
const pdfLib = require(libLocation + "pdfLib");
const commentsLib = require(libLocation + "commentsLib");
const notificationLib = require(libLocation + "notificationLib");
const cacheLib = require(libLocation + "cacheLib");
const countries = require(libLocation + "misc/countries");

const cache = cacheLib.api.createGlobalCache({
  name: "users",
  size: 1000,
  expire: 60 * 60 * 24
});

exports.get = handleReq;
exports.post = handleReq;

function handleReq(req) {
  var me = this;

  function renderView() {
    var view = resolve("user.html");
    var model = createModel();
    var body = thymeleaf.render(view, model);
    var commentsScript = portal.assetUrl({ path: "js/comments.js" });
    var userPageScript = portal.assetUrl({ path: "js/userpage.js" });
    return {
      body: body,
      contentType: "text/html",
      pageContributions: {
        bodyEnd: [
          "<script src='" + userPageScript + "'></script>",
          "<script src='" + commentsScript + "'></script>"
        ]
      }
    };
  }

  function createModel() {
    var up = req.params;
    var content = portal.getContent();
    content.image = norseUtils.getImage(
      content.data.userImage,
      "block(140,140)",
      1
    );

    let vk = null;
    if (content && content.data && content.data.vk) {
      vk = cache.api.getOnly(content._id + "-vk");
      if (!vk) {
        vk = userLib.getVkData(content._id);
        if (vk) cache.api.put(content._id + "-vk", vk);
      }
    }

    let facebook = null;
    if (content && content.data && content.data.facebook) {
      facebook = cache.api.getOnly(content._id + "-facebook");
      if (!facebook) {
        facebook = userLib.getFacebookData(content._id);
        if (facebook) cache.api.put(content._id + "-facebook", facebook);
      }
    }

    let discord = null;
    if (content && content.data && content.data.discord) {
      discord = cache.api.getOnly(content._id + "-discord");
      if (!discord) {
        discord = userLib.getDiscordData(content._id);
        if (discord) cache.api.put(content._id + "-discord", discord);
      }
    }

    const currUser = userLib.getCurrentUser();
    content.data.bookmarks = content.data.bookmarks
      ? norseUtils.forceArray(content.data.bookmarks)
      : 0;
    const userSystemObj = userLib.getSystemUser(content.data.email);
    const currUserFlag = currUser && currUser.user.key == userSystemObj.key;

    let userHasTicket =
      currUserFlag && currUser.content.data.kosticonnect2022 ? true : false;
    let ticket = null;
    if (currUserFlag && currUser.content.data.kosticonnect2022) {
      const cart = cartLib.getCartByQr(currUser.content.data.kosticonnect2022);
      if (cart)
        ticket = {
          turbo: cart.legendary,
          qr: cart.qr
        };
    }
    content.votes = blogLib.countUserRating(content._id);
    var date = new Date(moment(content.publish.from.replace("Z", "")));
    content.date =
      date.getDate() +
      " " +
      norseUtils.getMonthName(date) +
      " " +
      date.getFullYear();
    var totalArticles = {
      articles: blogLib.getArticlesByUser({
        id: content._id,
        page: 0,
        count: true,
        runInDraft: currUserFlag
      }),
      notifications: notificationLib.getNotificationsForUser(
        content._id,
        null,
        null,
        true
      ),
      comments: commentsLib.getCommentsByUser(content._id, 0, 1, true),
      games: getGames(true),
      orders: cartLib.getCartsByUser(content.data.email, content._id, true)
    };

    var active = {};
    if (up.action == "bookmarks" && currUserFlag) {
      totalArticles.curr = content.data.bookmarks
        ? content.data.bookmarks.length
        : 0;
      active.bookmarks = "active";
      var currTitle = "bookmarks";
      var articles = blogLib.getArticlesView(
        blogLib.getArticlesByIds(content.data.bookmarks).hits
      );
    } else if (up.action == "comments") {
      totalArticles.curr = totalArticles.comments;
      active.comments = "active";
      var currTitle = "comments";
      var userComments = commentsLib.getCommentsByUser(content._id).hits;
      var articles = thymeleaf.render(resolve("components/commentsView.html"), {
        comments: userComments
      });
    } else if (up.action == "notifications" && currUserFlag) {
      totalArticles.curr = totalArticles.notifications;
      active.notifications = "active";
      var currTitle = "notifications";
      var notifications = notificationLib.getNotificationsForUser(
        content._id,
        0,
        10
      );
      var articles = notifications.hits;
    } else if (up.action == "games" && currUserFlag) {
      const userGames = playerLib.getGamesByUser(undefined, false, true);
      totalArticles.curr = userGames.length;
      active.games = "active";
      var currTitle = "games";
      let festivals = formLib.getFestivalForGM(req.params.festId);
      let days = festivals.length
        ? formLib.getDaysGM(null, null, festivals[0]._id)
        : [];
      const playerFestivals = playerLib.getFestivalsForPlayer();
      let hasGames = false;
      playerFestivals.forEach((fest) => {
        fest.games = playerLib.getGamesByPlayer(fest._id);
        if (fest.games.length > 0) hasGames = true;
      });
      days.forEach((day) => {
        day.processed.available = thymeleaf.render(
          resolve("games/shared/availableComp.html"),
          {
            games: day.processed.games,
            festivals: festivals[0]._id
          }
        );
      });
      const showGmComponents = festivals.length > 0;
      const hideDiscordRequiredText =
        currUser &&
        ((currUser.content &&
          currUser.content.data.discord &&
          festivals[0] &&
          festivals[0].data.requireDiscord) ||
          (festivals[0] && !festivals[0].data.requireDiscord));
      var articles = thymeleaf.render(resolve("components/gamesView.html"), {
        currUser: currUser,
        hasGames: hasGames,
        playerFestivals: playerFestivals,
        currUserFlag: currUserFlag,
        festivals: festivals,
        content: content,
        showGmComponents: showGmComponents,
        gameMasterForm: thymeleaf.render(resolve("games/gm/gmComp.html"), {
          days: thymeleaf.render(resolve("games/shared/scheduleComp.html"), {
            days: days,
            festival: festivals[0]
          }),
          showGmComponents: showGmComponents,
          hideDiscordRequiredText: hideDiscordRequiredText
        }),
        tinymceStyles: thymeleaf.render(
          resolve("components/tinymceStyles.html"),
          {}
        )
      });
    } else if (up.action == "orders" && currUserFlag) {
      var orders = cartLib.getCartsByUser(content.data.email, content._id);
      totalArticles.curr = orders.length;
      active.orders = "active";
      var currTitle = "orders";
      let asterisk = false;
      orders.forEach((order) => {
        order.items.forEach((item) => {
          if (
            item.itemsIdsProcessed &&
            item.productType == "ticket" &&
            order.status == "paid"
          ) {
            order.asterisk = true;
            return;
          }
        });
        if (order.asterisk) return;
      });
      var articles = thymeleaf.render(resolve("components/ordersView.html"), {
        orders: orders,
        asterisk: asterisk
      });
    } else {
      totalArticles.curr = totalArticles.articles;
      active.articles = "active";
      var currTitle = "articles";
      var articles = blogLib.getArticlesView(
        blogLib.getArticlesByUser({ id: content._id, runInDraft: currUserFlag })
          .hits
      );
    }
    var pluralArticlesString = sharedLib.getTranslationCounter(
      totalArticles.curr
    );
    if (currUserFlag) {
      var editUserModal = thymeleaf.render(
        resolve("components/userEditModal.html"),
        {
          userHasTicket: userHasTicket,
          ticket: ticket,
          countries: countries,
          user: content,
          discord: discord,
          discordUrl: helpers.getDiscordUrl("me/discord"),
          vk: vk,
          vkUrl: helpers.getVkUrl("me/vk"),
          facebook: facebook
        }
      );
    }

    var model = {
      content: content,
      currUser: currUser,
      currUserFlag: currUserFlag,
      currTitle: currTitle,
      pluralArticlesString: pluralArticlesString,
      totalArticles: totalArticles,
      articles: articles,
      active: active,
      createArticleUrl: sharedLib.generateNiceServiceUrl("create"),
      loadMoreComponent: helpers.getLoadMore({
        articlesCount: totalArticles.curr,
        noMoreTitle: currTitle
      }),
      editUserModal: editUserModal,
      articlesView: articles,
      pageComponents: helpers.getPageComponents(req, "footerBlog"),
      action: up.action,
      discord: discord,
      vk: vk,
      facebook: facebook
    };

    function getGames(countOnly) {
      var games = contentLib.query({
        start: 0,
        count: -1,
        query:
          "fulltext('data.master, data.players', '" + content._id + "', 'OR')",
        contentTypes: [app.name + ":game"]
      });
      if (countOnly) {
        return games.total;
      }
      var result = [];
      var count = 0;
      var tempGames = games.hits;
      for (var i = 0; i < tempGames.length; i++) {
        if (!result[i]) {
          result[i] = {
            title: tempGames[i].displayName,
            games: []
          };
        }
        var blocks = norseUtils.forceArray(tempGames[i].data.eventsBlock);
        for (var j = 0; j < blocks.length; j++) {
          var events = norseUtils.forceArray(blocks[j].events);
          for (var k = 0; k < events.length; k++) {
            if (!events[k].users) continue;
            var users = norseUtils.forceArray(events[k].users);
            for (var n = 0; n < users.length; n++) {
              if (users[n].user === content._id) {
                result[i].games.push({
                  title: events[k].title,
                  time: blocks[j].time
                    ? moment(blocks[j].time).format("D.M.YYYY HH:mm")
                    : null
                });
                count++;
              }
            }
          }
        }
      }
      games.hits = result;
      games.total = count.toFixed();
      return games;
    }
    return model;
  }

  return renderView();
}
