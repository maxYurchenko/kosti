var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');
var thymeleaf = require('/lib/thymeleaf');

var libLocation = '../../lib/';
var norseUtils = require(libLocation + 'norseUtils');
var helpers = require(libLocation + 'helpers');
var kostiUtils = require(libLocation + 'kostiUtils');
var votesLib = require(libLocation + 'votesLib');
var userLib = require(libLocation + 'userLib');
var blogLib = require(libLocation + 'blogLib');
var commentsLib = require(libLocation + 'commentsLib');

exports.get = handleReq;

function handleReq(req) {
    var me = this;
    var user = userLib.getCurrentUser();

    function renderView() {
        var view = resolve('article.html');
        var model = createModel();
        var body = thymeleaf.render(view, model);
        var fileName = portal.assetUrl({path:'js/comments.js'});
         // Return the result
        return {
          body: body,
          contentType: 'text/html',
          pageContributions: {
            bodyEnd: [
                "<script src='"+fileName+"'></script>"
            ]
          }
        };
    }

    function createModel() {

        var up = req.params;
        var content = portal.getContent();
        content = blogLib.beautifyArticle(content);
        var response = [];
        var mainRegion = content.page.regions.main;
        var similarArticles = getSimilar( content.data.similarArticles );
        var comments = commentsLib.getCommentsByParent(content._id);
        comments = thymeleaf.render(resolve('comments.html'), {
            comments: comments, 
            articleId: content._id, 
            moderator: user.moderator
        });
        if( user.moderator ){
            var removeCommentModal = thymeleaf.render(resolve('../components/comments/removeCommentModal.html'), {});
        }

        var model = {
            content: content,
            socialLinks: blogLib.getSolialLinks(),
            mainRegion: mainRegion,
            removeCommentModal: removeCommentModal,
            weeksPost: blogLib.getWeeksPost(),
            pageComponents: helpers.getPageComponents(req),
            similarArticles: similarArticles,
            comments: comments,
            bookmarked: userLib.checkIfBookmarked(content._id)
        };

        return model;
    }

    function getSimilar( ids ){
        if( ids ){
            var result = [];
            ids = norseUtils.forceArray(ids);
            for( var i = 0; i < ids.length; i++ ){
                var article = contentLib.get({ key: ids[i] });
                if( article ){
                    result.push({
                        _id: article._id,
                        url: portal.pageUrl({ path: article._path }),
                        displayName: article.displayName,
                        votes: votesLib.countUpvotes( article._id ),
                        voted: votesLib.checkIfVoted( article._id )
                    });
                }
            }
            return result;
        } else {
            return false;
        }
    }

    return renderView();
}