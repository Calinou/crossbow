var _           = require("lodash");
var multiline   = require("multiline");
var sinon       = require("sinon");
var fs          = require("fs");
var assert      = require("chai").assert;
var crossbow    = require("../../../index");

describe("@inc helper", function(){

    beforeEach(function () {
        crossbow.clearCache();
    });

    it("Can save a rendered include", function(done) {

        var index = multiline.stripIndent(function(){/*

        before save
        {@save src="button.html" name="shane"/}
        After save
        
        {@inc src="saved:button.html" /}
         */});

        crossbow.populateCache("button.html", "<button>{name}</button>");

        var page = crossbow.addPage("index.html", index, {});

        crossbow.compileOne(page, {siteConfig:{}}, function (err, out) {
            if (err) {
                done(err);
            }
            assert.include(out.compiled, "<button>shane</button>");
            done();
        });
    });
});