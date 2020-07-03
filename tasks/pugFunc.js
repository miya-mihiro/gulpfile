const { src, dest, lastRun } = require("gulp");

const config = require("./../config.json");
const project = config.project;
const root = config.root;
const sftpcon = config.sftp;
const ftp = config.ftp;
const taskswitch = config.taskswitch;
const sassStyle = config.sassStyle;

const plumber = require("gulp-plumber");
const changed = require("gulp-changed");
const gulpif = require("gulp-if");
const rename = require("gulp-rename");

const pug = require("gulp-pug");

// const sftp = require('gulp-sftp-up4');
const vftp = require("vinyl-ftp");
const conn = vftp.create(ftp);

const sftp = require("gulp-ssh");
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

const sftpSwitch = taskswitch.sftp,
  ftpSwitch = taskswitch.ftp;
const options = {
  filters: {
    php: (text) => {
      text = "<?php " + text + " ?>";
      return text;
    },
  },
  pretty: true,
};

function pugFunc() {
  return src(root.projectDir + "/**/*.pug")
    .pipe(changed(root.changeDir))
    .pipe(plumber())
    .pipe(pug(options))
    .pipe(
      rename({
        extname: ".php", //phpファイルとして書き出し
      })
    )
    .pipe(dest(root.projectDir))
    .pipe(dest(root.changeDir))
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir)));
}

function pugFuncSftp() {
  return src(root.projectDir + "/**/*.pug")
    .pipe(changed(root.changeDir))
    .pipe(plumber())
    .pipe(pug(options))
    .pipe(dest(root.projectDir))
    .pipe(dest(root.changeDir))
    .pipe(gulpSSH.dest(root.uploadDir));
}

exports.pugFunc = pugFunc;
exports.pugFuncSftp = pugFuncSftp;
