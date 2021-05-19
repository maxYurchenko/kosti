var thymeleaf = require('/lib/thymeleaf');
var authLib = require('/lib/xp/auth');
var libLocation = '../../lib/';
var portal = require('/lib/xp/portal');
var contentLib = require('/lib/xp/content');\

var libLocation = '../../lib/';
var norseUtils = require(libLocation + 'norseUtils');
var helpers = require(libLocation + 'helpers');
var userLib = require("/lib/userLib");
var spellLib = require(libLocation + 'spellsLib');

exports.get = handleReq;
exports.post = handleReq;

function handleReq(req) {
    var me = this;

    function renderView() {
        var view = resolve('userSign.html');
        var model = createModel();
        var body = thymeleaf.render(view, model);
        return {
          body: body,
          contentType: 'text/html'
        };
    }

    function createModel() {

        var up = req.params;
        var content = portal.getContent();
        var response = [];
        var site = portal.getSiteConfig();

        var model = {
            content: content,
            app: app,
            social: site.social,
            pageComponents: helpers.getPageComponents(req)
        };

        return model;


    }

    return renderView();
}