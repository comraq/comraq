export default (gulp, getTask, getTest) => {
  // Top level compilation of sub-tasks
  gulp.task("build-all", [
    "minify-vendor-js",
    "minify-js",
    "minify-server-js"
  ]);
  gulp.task("watch-all", [
    "minify-vendor-js",
    "watchify-js",
    "watch-server-js"
  ]);

  // Sub Tasks (Client)
  gulp.task("watchify-js", getTask("watchify-js"));
  gulp.task("minify-js", getTask("minify-js"));

  gulp.task("minify-vendor-js", getTask("minify-vendor-js"));

  // Sub Tasks (Server)
  gulp.task("watch-server-js", getTask("watch-server-js"));
  gulp.task("minify-server-js", getTask("minify-server-js"));

  // Test Tasks
  gulp.task("test-karma", getTest("karma"));
};
