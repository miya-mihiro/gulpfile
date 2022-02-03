/** @format */
// gulpプラグインの読み込み
const { src, dest, series, watch, lastRun, parallel } = require("gulp");

const config = require("./config.json");
const project = config.project;
const root = config.root;
const taskswitch = config.taskswitch;

/** ローカルホストの立ち上げ + リロード
 * ***************************************************/

const { browsersync, browserReload } = require("./tasks/browserSync.js");
exports.browsersync = browsersync;
exports.browserReload = browserReload;

/** sass
 * ***************************************************/
// SFTPのとき：sassComplieSftp
// FTP or local；sassComplie
const { sassComplieSftp, sassComplie } = require("./tasks/sassFunc.js");
exports.sassComplieSftp = sassComplieSftp;
exports.sassComplie = sassComplie;

/** js
 * ***************************************************/
const { jsMin, jsMinSftp } = require("./tasks/jsFunc.js");
exports.jsMin = jsMin;
exports.jsMinSftp = jsMinSftp;

// /** images */
// /**************************************** */
const {
  imgMin,
  imgUpload,
  imgUploadSftp,
  imgMinSftp,
} = require("./tasks/imgFunc.js");
exports.imgMin = imgMin;
exports.imgUpload = imgUpload;

exports.imgUploadSftp = imgUploadSftp;
exports.imgMinSftp = imgMinSftp;

// /** pug */
// /**************************************** */
const { pugFunc, pugFuncSftp } = require("./tasks/pugFunc.js");
exports.pugFunc = pugFunc;
exports.pugFuncSftp = pugFuncSftp;

function watchTasks(done) {
  var env;
  // taskswitchでどの環境でgulpが動いているかをチェック
  if (taskswitch.localHost) {
    env = "localHost";
  } else if (taskswitch.sftp) {
    env = "sftp";
  }
  switch (env) {
    case "localHost":
      if (taskswitch.sass) {
        watch(
          root.projectDir + project.sasssrcDir + "/**/*.scss",
          series(sassComplie, browserReload)
        );
      }
      if (taskswitch.jsmin) {
        watch(
          root.projectDir + project.jssrcDir + "/*.js",
          series(jsMin, browserReload)
        );
      }
      if (taskswitch.img) {
        watch(
          root.projectDir + project.imgsrcDir + "/**/*.+(jpg|jpeg|png|gif|svg)",
          series(parallel(imgMin, imgUpload), browserReload)
        );
      }
      if (taskswitch.pug) {
        watch(root.projectDir + "**/*.pug", series(pugFunc, browserReload));
      }
      done();
      break;
    case "sftp":
      if (taskswitch.sass) {
        watch(
          root.projectDir + project.sasssrcDir + "/**/*.scss",
          sassComplieSftp
        );
      }
      if (taskswitch.jsmin) {
        watch(root.projectDir + project.jssrcDir + "/*.js", jsMinSftp);
      }
      if (taskswitch.img) {
        watch(
          root.projectDir + project.imgsrcDir + "/**/*.+(jpg|jpeg|png|gif|svg)",
          parallel(imgMinSftp, imgUploadSftp)
        );
      }
      if (taskswitch.pug) {
        watch(root.projectDir + "*.pug", pugFuncSftp);
      }
      done();
      break;
    default:
      if (taskswitch.sass) {
        watch(root.projectDir + project.sasssrcDir + "/**/*.scss", sassComplie);
      }
      if (taskswitch.jsmin) {
        watch(root.projectDir + project.jssrcDir + "/*.js", jsMin);
      }
      if (taskswitch.img) {
        watch(
          root.projectDir + project.imgsrcDir + "/**/*.+(jpg|jpeg|png|gif|svg)",
          parallel(imgMin, imgUpload)
        );
      }
      if (taskswitch.pug) {
        watch(root.projectDir + "*.pug", pugFunc);
      }
      done();
      break;
  }
}

/** default task */
/**************************************** */

if (taskswitch.localHost) {
  /* ↓↓↓ ローカル + ローカル環境 ↓↓↓ ::::::::::::::: */
  exports.default = series(browsersync, watchTasks);
} else {
  /* ↓↓↓ ローカルだけ ↓↓↓ ::::::::::::::::: */
  exports.default = watchTasks;
}
