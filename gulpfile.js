/** @format */

// gulpプラグインの読み込み
const { src, dest, series, watch, lastRun, parallel } = require("gulp");

const config = require("./config.json");
const project = config.project;
const root = config.root;
const taskswitch = config.taskswitch;

/******************************************************************* */

/** ローカルホストの立ち上げ + リロード */
/**************************************** */
const { browsersync, browserReload } = require("./tasks/browserSync.js");
exports.browsersync = browsersync;
exports.browserReload = browserReload;

// /** sass */
// /**************************************** */
const {
  sassComplie,
  sassSftp,
  sassFtp,
  cssFunc,
  cssFuncSftp,
} = require("./tasks/sassFunc.js");
exports.sassComplie = sassComplie;
exports.sassSftp = sassSftp;
exports.sassFtp = sassFtp;
exports.cssFunc = cssFunc;
exports.cssFuncSftp = cssFuncSftp;

// /** js */
// /**************************************** */
const {
  jsMin,
  jsFtp,
  jsSftp,
  jsMinSftp,
  jsMigrate,
  jsMigrateFtp,
  jsMigratSftp,
  jsAfterMigrateSftp,
} = require("./tasks/jsFunc.js");
exports.jsMin = jsMin;
exports.jsFtp = jsFtp;
exports.jsSftp = jsSftp;
exports.jsMinSftp = jsMinSftp;

exports.jsMigrate = jsMigrate;
exports.jsMigrateFtp = jsMigrateFtp;
exports.jsMigratSftp = jsMigratSftp;
exports.jsAfterMigrateSftp = jsAfterMigrateSftp;

const integrateFile = project.integrateFile;

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

// /** watch */
// /**************************************** */
// localの監視タスク

function watchTasks(done) {
  var env;
  if (taskswitch.localHost) {
    env = "localHost";
  } else if (taskswitch.sftp) {
    env = "sftp";
  } else if (taskswitch.ftp) {
    env = "ftp";
  }
  switch (env) {
    case "localHost":
      if (taskswitch.sass) {
        watch(
          root.projectDir + project.sasssrcDir + "/**/*.scss",
          series(parallel(series(sassComplie, cssFunc), sassFtp), browserReload)
        );
      }
      if (taskswitch.jsmin) {
        watch(
          root.projectDir + project.jssrcDir + "/**/*.js",
          series(jsMin, browserReload)
        );
      }
      if (taskswitch.jsintegrate) {
        watch(
          root.projectDir + project.jsintegrateDir + "/**/*.js",
          series(jsMigrate, browserReload)
        );
      }
      if (taskswitch.img) {
        watch(
          root.projectDir + project.imgsrcDir + "/**/*.+(jpg|jpeg|png|gif|svg)",
          series(parallel(imgMin, imgUpload), browserReload)
        );
      }

      if (taskswitch.pug && taskswitch.csspurge) {
        watch(
          root.projectDir + "**/*.pug",
          series(pugFunc, cssFunc, browserReload)
        );
      } else if (taskswitch.pug && !taskswitch.csspurge) {
        watch(root.projectDir + "**/*.pug", series(pugFunc, browserReload));
      } else if (!taskswitch.pug && taskswitch.csspurge) {
        watch(
          root.projectDir + "**/*.(php|html)",
          series(cssFunc, browserReload)
        );
      } else {
        watch(root.projectDir + "**/*.(php|html)", browserReload);
      }
      done();
      break;
    case "sftp":
      if (taskswitch.sass) {
        watch(
          root.projectDir + project.sasssrcDir + "/**/*.scss",
          parallel(series(sassComplie, cssFuncSftp), sassSftp)
        );
      }
      if (taskswitch.jsmin) {
        watch(
          root.projectDir + project.jssrcDir + "/**/*.js",
          parallel(jsMinSftp, jsSftp)
        );
      }
      if (taskswitch.jsintegrate) {
        watch(
          root.projectDir + project.jsintegrateDir + "/**/*.js",
          parallel(jsMigrate, jsAfterMigrateSftp)
        );
      }
      if (taskswitch.img) {
        watch(
          root.projectDir + project.imgsrcDir + "/**/*.+(jpg|jpeg|png|gif|svg)",
          parallel(imgMinSftp, imgUploadSftp)
        );
      }

      if (taskswitch.pug && taskswitch.csspurge) {
        watch(root.projectDir + "**/*.pug", series(pugFuncSftp, cssFuncSftp));
      } else if (taskswitch.pug && !taskswitch.csspurge) {
        watch(root.projectDir + "**/*.pug", pugFuncSftp);
      } else if (!taskswitch.pug && taskswitch.csspurge) {
        watch(root.projectDir + "**/*.+(php|html)", cssFuncSftp);
      }

      done();
      break;
    case "ftp":
      if (taskswitch.sass) {
        watch(
          root.projectDir + project.sasssrcDir + "/**/*.scss",
          series(parallel(series(sassComplie, cssFunc), sassFtp))
        );
      }
      if (taskswitch.jsmin) {
        watch(
          [
            root.projectDir + project.jssrcDir + "/**/*.js",
            !root.projectDir + project.jssrcDir + "/" + integrateFile,
          ],
          parallel(jsMin, jsFtp)
        );
      }
      if (taskswitch.jsintegrate) {
        watch(
          root.projectDir + project.jsintegrateDir + "/**/*.js",
          parallel(jsMigrate, jsMigrateFtp)
        );
      }
      if (taskswitch.img) {
        watch(
          root.projectDir + project.imgsrcDir + "/**/*.+(jpg|jpeg|png|gif|svg)",
          parallel(imgMin, imgUpload)
        );
      }

      if (taskswitch.pug && taskswitch.csspurge) {
        watch(root.projectDir + "**/*.pug", series(pugFunc, cssFunc));
      } else if (taskswitch.pug && !taskswitch.csspurge) {
        watch(root.projectDir + "**/*.pug", pugFunc);
      } else if (!taskswitch.pug && taskswitch.csspurge) {
        watch(root.projectDir + "**/*.+(php|html)", cssFunc);
      }

      done();
      break;
    default:
      if (taskswitch.jsmin) {
        watch(
          root.projectDir + project.jssrcDir + "/**/*.js",
          series(jsMin, browserReload)
        );
      }
      if (taskswitch.jsintegrate) {
        watch(
          root.projectDir + project.jsintegrateDir + "/**/*.js",
          series(jsMigrate, browserReload)
        );
      }
      if (taskswitch.img) {
        watch(
          root.projectDir + project.imgsrcDir + "/**/*.+(jpg|jpeg|png|gif|svg)",
          parallel(imgMin, imgUpload)
        );
      }
      if (taskswitch.sass) {
        watch(
          root.projectDir + project.sasssrcDir + "/**/*.scss",
          series(parallel(series(sassComplie, cssFunc), sassFtp))
        );
      }
      if (taskswitch.pug && taskswitch.csspurge) {
        watch(root.projectDir + "**/*.pug", series(pugFunc, cssFunc));
      } else if (taskswitch.pug && !taskswitch.csspurge) {
        watch(root.projectDir + "**/*.pug", pugFunc);
      } else if (!taskswitch.pug && taskswitch.csspurge) {
        watch(root.projectDir + "**/*.+(php|html)", cssFunc);
      }

      done();
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
