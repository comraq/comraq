export default wagner => {
  // Client JS Paths
  wagner.constant("BIN_PATH", "./dist");
  wagner.constant("JS_SRC", "./src/index.js")
  wagner.constant("JS_SRC_GLOB", [
                    "./src/**/*.js"
                  ]);
  wagner.constant("JS_DEST", "comraq.min.js");

  wagner.constant("JS_VEND_SRC", "./vendor/index.js");
  wagner.constant("JS_VEND_DEST", "./vendor/vendors.min.js");

  // Test Paths
  wagner.constant("KARMA_CONF",
                    __dirname + "/../karma.conf.js");
  wagner.constant("TESTS_PATH", "./test/*.js");
  wagner.constant("TESTS_SRC_JS", [
    "./**/*.js",
    "!./node_modules/**/*.js",
    "!./gulpfile.js",
    "!./gulp/**/*.js",
    "!./test/**/*.js"
  ]);
};
