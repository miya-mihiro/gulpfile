const { src, dest, lastRun } = require("gulp");

const config = require("./../config.json");
const project = config.project;
const root = config.root;
const sftpcon = config.sftp;
const ftp = config.ftp;
const taskswitch = config.taskswitch;
const sassStyle = config.sassStyle;

const rename = require("gulp-rename");

const plumber = require("gulp-plumber");
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const progeny = require("gulp-progeny");
const gulpif = require("gulp-if");

// const sftp = require('gulp-sftp-up4');
const sftp = require("gulp-ssh");
const vftp = require("vinyl-ftp");
const conn = vftp.create(ftp);
const sftpconfig = {
  host: sftpcon.host,
  username: sftpcon.user,
  password: sftpcon.pass,
  port: sftpcon.port,
};

var gulpSSH = new sftp({
  ignoreErrors: false,
  sshConfig: sftpconfig,
});
const ftpSwitch = taskswitch.ftp,
  sassexp = sassStyle.sassexp,
  sassmin = sassStyle.sassmin,
  csspurge = taskswitch.csspurge;

// local環境のsassコンパイルタスク  *********************
function sassComplieSftp() {
  return src(root.projectDir + project.sasssrcDir + "/**/*.scss", {
    since: lastRun(sassComplie),
  })
    .pipe(gulpSSH.dest(root.uploadDir + project.sasssrcDir))
    .pipe(
      progeny({
        content: [root.projectDir + project.purgeContentFiles],
        safelist: {
          greedy: [/.*is/],
        },
      })
    )
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log(err.messageFormatted);
          this.emit("end");
        },
      })
    )
    .pipe(
      gulpif(
        sassexp,
        sass({
          outputStyle: "expanded",
        }).on("error", sass.logError)
      )
    )
    .pipe(
      gulpif(
        sassmin,
        sass({
          outputStyle: "compressed",
        }).on("error", sass.logError)
      )
    )
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: ["last 2 versions", "ie >= 11", "Android >= 4"],
          cascade: false,
        }),
      ])
    )
    .pipe(
      gulpif(
        sassmin,
        rename({
          suffix: ".min",
        })
      )
    )
    .pipe(dest(root.projectDir + project.sassdstDir))
    .pipe(gulpSSH.dest(root.uploadDir + project.sassdstDir));
}
function sassComplie() {
  return src(root.projectDir + project.sasssrcDir + "/**/*.scss", {
    since: lastRun(sassComplie),
  })
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir + project.sasssrcDir)))
    .pipe(
      progeny({
        content: [root.projectDir + project.purgeContentFiles],
        safelist: {
          greedy: [/.*is/],
        },
      })
    )
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log(err.messageFormatted);
          this.emit("end");
        },
      })
    )
    .pipe(
      gulpif(
        sassexp,
        sass({
          outputStyle: "expanded",
        }).on("error", sass.logError)
      )
    )
    .pipe(
      gulpif(
        sassmin,
        sass({
          outputStyle: "compressed",
        }).on("error", sass.logError)
      )
    )
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: ["last 2 versions", "ie >= 11", "Android >= 4"],
          cascade: false,
        }),
      ])
    )
    .pipe(
      gulpif(
        sassmin,
        rename({
          suffix: ".min",
        })
      )
    )
    .pipe(dest(root.projectDir + project.sassdstDir))
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir + project.sassdstDir)));
}

// タスクの定義？  *********************
exports.sassComplieSftp = sassComplieSftp;
exports.sassComplie = sassComplie;
