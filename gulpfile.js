var gulp         = require("gulp");
var crossbow     = require("./");
var browserSync  = require("browser-sync");
var noAbs        = require("no-abs");
var rimraf       = require("rimraf");
var htmlInjector = require("bs-html-injector");

/**
 * Start BrowserSync
 */
gulp.task("serve", function () {
    browserSync({
        open: false,
        server: {
            baseDir: "_site",
            routes: {
                "/img": "./img",
                "/css": "test/fixtures/css"
            }
        }
    });
});

/**
 * Default task
 */
gulp.task("crossbow", function () {
    return gulp.src([
        //"test/fixtures/*.html",
        //"test/fixtures/_posts/**"
        "test/fixtures/index.html",
        "test/fixtures/docs/**"
        //"test/fixtures/projects/**"
    ])
    .pipe(crossbow.stream({
        config: {
            base: "test/fixtures",
            defaultLayout: "default.html",
            prettyUrls: true
        },
        data: {
            site: "file:_config.yml",
            cats: "file:_config.json"
        }
    }))
    .pipe(gulp.dest("_site"));
});

gulp.task("watch", function () {
    gulp.watch(["test/fixtures/**"], ["crossbow", browserSync.reload]);
});

gulp.task("clean", function (done) {
    rimraf.sync("./_site");
    done();
});

gulp.task("default", ["clean", "crossbow", "serve", "watch"]);