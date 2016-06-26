module.exports = function(gulp, plugins, BIN_PATH_NODE, JS_SRC_GLOB) {
  return function() {
    return gulp.src(JS_SRC_GLOB)
      .pipe(plugins.babel())
      .pipe(gulp.dest(BIN_PATH_NODE));
  };
};
