var utils = require("../../utils");

/**
 * @returns {{section: section}}
 */
module.exports = function (logger, emitter) {

    var sections = {};

    return {
        "section": function (options) {

            var args    = Array.prototype.slice.call(arguments);
            var options = args[args.length-1];

            var params = utils.processParams(options.hash || {}, options.data.root);
            if (!utils.verifyParams(params, ["name"])) {
                emitter.emit("log", {
                    type: "warn",
                    msg: "You must provide a `name` parameter to the section helper",
                    _crossbow: options._crossbow
                });
                return;
            }

            logger.debug("Saving content as section name: {magenta:%s}", params["name"]);
            sections[params["name"]] = options.fn(options.data.root);
        },
        "yield": require("./yield")(sections, logger, emitter)
    };
};