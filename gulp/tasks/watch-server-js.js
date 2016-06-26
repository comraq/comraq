module.exports = function(gulp, JS_SRC_GLOB) {
  return function() {
    return gulp.watch(JS_SRC_GLOB, [ "minify-server-js" ]);
  };
};
