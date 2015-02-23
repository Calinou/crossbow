var gulp         = require("gulp");
var crossbow     = require("./");
var browserSync  = require("browser-sync");
var noAbs        = require("no-abs");
var rimraf       = require("rimraf");
var htmlInjector = require("bs-html-injector");
var site         = crossbow.builder({
    config: {
        base: "test/fixtures",
        defaultLayout: "default.html",
        prettyUrls: true
    },
    data: {
        site: "file:_config.yml",
        cats: "file:_config.json"
    }
});

/**
 * Start BrowserSync
 */
gulp.task("serve", function () {
    browserSync.use(htmlInjector);
    browserSync({
        open: false,
        logLevel: "silent",
        server: {
            baseDir: "_site",
            routes: {
                "/img": "./img",
                "/css": "test/fixtures/css"
            }
        }
    }, function (err, bs) {
        site.logger.info("View your website at: {yellow:%s}", bs.getOptionIn(["urls", "local"]));
        site.logger.info("View your website at: {yellow:%s}", bs.getOptionIn(["urls", "external"]));
    });
});

function buildSite() {
    return gulp.src([
        "test/fixtures/index.html",
        "test/fixtures/docs/**"
    ])
        .pipe(crossbow.stream({builder: site}))
        .pipe(gulp.dest("_site"));
}

/**
 * Default task
 */
gulp.task("crossbow", function () {
    buildSite();
});

gulp.task("watch", function () {
    gulp.watch(["test/fixtures/**"]).on("change", function (file) {
        if (file.type === "deleted" || file.type === "added" || file.type === "renamed") {
            buildSite().on("end", function () {
                browserSync.reload();
            });
        } else {
            gulp.src(file.path)
                .pipe(crossbow.stream({builder: site}))
                .pipe(gulp.dest("_site"))
                .on("end", function () {
                    browserSync.notify("<span style='color: magenta'>Crossbow:</span> Injecting HTML");
                    htmlInjector();
                });
        }
    });
});

gulp.task("clean", function (done) {
    rimraf.sync("./_site");
    done();
});

gulp.task("default", ["clean", "crossbow", "serve", "watch"]);