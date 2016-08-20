import plugins from "gulp-load-plugins";
import browserify from "browserify";
import babelify from "babelify";
import buffer from "vinyl-buffer";
import source from "vinyl-source-stream";

export default wagner => {
  wagner.factory("plugins", () => plugins());

  // List of external vendor dependencies
  wagner.factory("vendorDeps", () => [
    "react",
    "react-dom"
  ]);

  wagner.factory("getTask", () => getTask);
  wagner.factory("getTest", () => getTest);

  // A transformed browserify instance with all options/pluggins set
  wagner.factory("transformedInst", (JS_SRC, vendorDeps) => {
    const options = {
      entries: [ JS_SRC ],
      cache: {},
      packageCache: {},
      poll: 100,
      delay: 0
    };

    const b = browserify(options);

    // Externalize the vendor require/imports from source code
    // and require them from a separate bundle
    vendorDeps.forEach(dep => b.external(dep));

    return b.transform(babelify);
  });

  // Client js build function, also === "minify-js" gulp task
  // Needed as a dependency due to watchify
  wagner.factory("minifyJs", (gulp, plugins,
                              JS_DEST, BIN_PATH, transformedInst) =>
    browserifyInst => {
      let instance = browserifyInst || transformedInst;
      let production = plugins.util.env.production || false;
      let minify = plugins.util.env.nomin || false;

      return instance
        .bundle()
        .on("error", err => {
          plugins.util.log(err);
          this.emit("end");
        })
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(plugins.rename(JS_DEST))
        .pipe((!production)?
                  plugins.sourcemaps.init({ loadMaps: true })
               :
                  plugins.util.noop())
          .pipe((!minify)?
                    plugins.uglify()
                 :
                    plugins.util.noop())
        .pipe((!production)?
                plugins.sourcemaps.write() : plugins.util.noop())
        .pipe(gulp.dest(BIN_PATH));
    }
  );

  // Log the status of production flag
  wagner.invoke(plugins => {
    let production = plugins.util.env.production || false;

    let colour = (production)?
                   plugins.util.colors.bgGreen
                 :
                   plugins.util.colors.bgYellow;

    plugins.util.log("Production", colour(production));
  });

  // Get task utility functions
  const gulpTasksDir = "./tasks/";
  const getTask = task => wagner.invoke(require(gulpTasksDir + task));

  const gulpTestsDir = "./tests/";
  const getTest = test => wagner.invoke(require(gulpTestsDir + test));
};
