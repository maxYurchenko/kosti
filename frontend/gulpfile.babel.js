const gulp = require("gulp");
const sass = require("gulp-sass");
//var fontAwesome = require('node-font-awesome');
const iconfont = require("gulp-iconfont");
const iconfontCss = require("gulp-iconfont-css");
const runSequence = require("gulp4-run-sequence");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const pump = require("pump");
const argv = require("yargs").argv;
const minify = require("gulp-babel-minify");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const concat = require("gulp-concat");

var fontName = "iconfont";

gulp.task("build", function (callback) {
  runSequence(
    ["sass", "images", "fonts", "js", "css", "lib"],
    "copy",
    callback
  );
});

gulp.task("sass", function () {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest("build/css"));
});

gulp.task("images", function () {
  if (argv.dev) {
    return gulp.src("app/images/**/*").pipe(gulp.dest("build/images"));
  } else {
    return gulp
      .src("app/images/**/*")
      .pipe(imagemin({ progressive: true }))
      .pipe(gulp.dest("build/images"));
  }
});

gulp.task("lib", function () {
  return gulp.src("app/lib/**/*").pipe(gulp.dest("build/lib"));
});

gulp.task("js", function (cb) {
  //TODO: add concat and babel
  if (argv.dev) {
    pump([gulp.src("app/js/**/*"), gulp.dest("build/js")], cb);
  } else {
    pump([gulp.src("app/js/**/*"), uglify(), gulp.dest("build/js")], cb);
  }
});

gulp.task("fonts", function () {
  return gulp.src("app/fonts/**/*").pipe(gulp.dest("build/fonts"));
});

gulp.task("css", function () {
  return gulp.src("app/css/**/*").pipe(gulp.dest("build/css"));
});

gulp.task("copy", function () {
  return gulp
    .src("build/**/*")
    .pipe(gulp.dest("../app/src/main/resources/assets"));
});

/*gulp.task('fontawesome', function() {
  gulp.src(fontAwesome.fonts)
	.pipe(gulp.dest('build/fonts'));
});*/

gulp.task("iconfont", function () {
  return gulp
    .src(["app/icons/*.svg"])
    .pipe(
      iconfontCss({
        fontName: fontName,
        path: "app/scss/base/_iconfont_template.scss",
        targetPath: "../scss/base/_iconfont.scss",
        fontPath: "../fonts/",
        firstGlyph: 0xf120 // Codes for glyphs should be in area where are no icons by default on iOS and Android
      })
    )
    .pipe(
      iconfont({
        fontName: fontName,
        formats: ["ttf", "woff", "woff2"],
        fontHeight: 1001,
        normalize: true
      })
    )
    .pipe(gulp.dest("app/fonts"));
});

gulp.task("watch", function () {
  gulp.series("build")();
  gulp.watch("app/**/*", gulp.series("build"));
});
