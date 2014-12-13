var Handlebars    = require("handlebars");
var markdown      = require("../markdown");
var utils      = require("../../utils");
var hbFilters     = require("./filters");

module.exports = function (cbUtils) {
    Handlebars.registerHelper("$dump", dumpHelperFn);
};

function dumpHelperFn (item) {
    return new Handlebars.SafeString(
        utils.wrapCode(
            utils.escapeHtml(JSON.stringify(item, null, 4))
        )
    );
}