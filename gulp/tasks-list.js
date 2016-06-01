export default (gulp, getTask, getTest) => {
  // Top level compilation of sub-tasks
  gulp.task("build-all", [
    "minify-vendor-js",
    "minify-js"
  ]);
  gulp.task("watch-all", [
    "minify-vendor-js",
    "watchify-js"
  ]);

  // Sub Tasks (Client)
  gulp.task("watchify-js", getTask("watchify-js"));
  gulp.task("minify-js", getTask("minify-js"));

  gulp.task("minify-vendor-js", getTask("minify-vendor-js"));

  // Test Tasks
  gulp.task("test-karma", getTest("karma"));
};
