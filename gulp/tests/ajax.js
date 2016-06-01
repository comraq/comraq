var Server = require("karma").Server;

module.exports = function(gulp, KARMA_CONF) {
  return function(finish) {
    return new Server({
      configFile: KARMA_CONF,
    }, function() { return finish(); }).start();
  };
};
