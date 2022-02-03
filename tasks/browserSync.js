const config = require("./../config.json");
const browser = config.browser;

var browserSync = require("browser-sync");
var connect = require("gulp-connect-php");

function browsersync(done) {
  connect.server(
    {
      port: 8001,
      base: browser.root,
      livereload: true,
    },
    function () {
      browserSync({
        proxy: "localhost:8001",
      });
    }
  );
  done();
}

function browserReload(done) {
  browserSync.reload();
  done();
  console.info("Browser reload completed");
}

exports.browsersync = browsersync;
exports.browserReload = browserReload;
