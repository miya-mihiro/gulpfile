const { src, dest, series, watch, lastRun, parallel } = require('gulp');

const config = require('./../config.json');
const project = config.project;
const root = config.root;
const sftpcon = config.sftp;
const ftp = config.ftp;
const taskswitch = config.taskswitch;
const jsStyle = config.jsStyle;

const babel = require('gulp-babel');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const gulpif = require('gulp-if');

// const sftp = require('gulp-sftp-up4');
const vftp = require('vinyl-ftp');
const conn = vftp.create(ftp);

const sftp = require('gulp-ssh');
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
  jses6 = jsStyle.jses6,
  integrateFile = project.integrateFile;

// js圧縮タスク  *********************

function jsMin() {
  return src(root.projectDir + project.jssrcDir + '/**/*.js')
    .pipe(changed(root.changeDir + project.jssrcDir))
    .pipe(dest(root.changeDir + project.jssrcDir))
    .pipe(plumber())
    .pipe(
      gulpif(
        jses6,
        babel({
          presets: ['@babel/preset-env'],
        })
      )
    )
    .pipe(gulpif(jses6, dest(root.projectDir + project.jses6Dir)))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(dest(root.projectDir + project.jsdstDir))
    .pipe(dest(root.changeDir + project.jsdstDir))
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir + project.jsdstDir)));
}

function jsMinSftp() {
  return src(root.projectDir + project.jssrcDir + '/**/*.js')
    .pipe(changed(root.changeDir + project.jssrcDir))
    .pipe(dest(root.changeDir + project.jssrcDir))
    .pipe(plumber())
    .pipe(
      gulpif(
        jses6,
        babel({
          presets: ['@babel/preset-env'],
        })
      )
    )
    .pipe(gulpif(jses6, dest(root.projectDir + project.jses6Dir)))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(dest(root.projectDir + project.jsdstDir))
    .pipe(dest(root.changeDir + project.jsdstDir))
    .pipe(gulpSSH.dest(root.uploadDir + project.jsdstDir));
}

function jsFtp() {
  return src(root.projectDir + project.jssrcDir + '/**/*.js')
    .pipe(changed(root.changeDir + project.jssrcDir))
    .pipe(conn.dest(root.uploadDir + project.jssrcDir));
}
function jsSftp() {
  return src(root.projectDir + project.jssrcDir + '/**/*.js')
    .pipe(changed(root.changeDir + project.jssrcDir))
    .pipe(gulpSSH.dest(root.uploadDir + project.jssrcDir));
}

function jsMigrate() {
  return src(root.projectDir + project.jsconcatDir + '/**/*.js')
    .pipe(dest(root.changeDir + project.jsconcatDir))
    .pipe(plumber())
    .pipe(concat(integrateFile))
    .pipe(dest(root.projectDir + project.jssrcDir))
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir + project.jssrcDir)));
}

function jsMigrateFtp() {
  return src(root.projectDir + project.jsconcatDir + '/**/*.js')
    .pipe(changed(root.changeDir + project.jsconcatDir))
    .pipe(dest(root.changeDir + project.jsconcatDir))
    .pipe(conn.dest(root.uploadDir + project.jsconcatDir));
}

function jsMigratSftp() {
  return src(root.projectDir + project.jsconcatDir + '/**/*.js')
    .pipe(changed(root.changeDir + project.jsconcatDir))
    .pipe(dest(root.changeDir + project.jsconcatDir))
    .pipe(gulpSSH.dest(root.uploadDir + project.jsconcatDir));
}

function jsAfterMigrateSftp() {
  return src(root.projectDir + project.jsconcatDir + '/**/*.js')
    .pipe(dest(root.changeDir + project.jsconcatDir))
    .pipe(plumber())
    .pipe(concat(integrateFile))
    .pipe(dest(root.projectDir + project.jssrcDir))
    .pipe(gulpSSH.dest(root.uploadDir + project.jssrcDir));
}

// js統合タスク  *********************
exports.jsMin = jsMin;
exports.jsMinSftp = jsMinSftp;
exports.jsFtp = jsFtp;
exports.jsSftp = jsSftp;

exports.jsMigrate = jsMigrate;
exports.jsMigrateFtp = jsMigrateFtp;
exports.jsMigratSftp = jsMigratSftp;
exports.jsAfterMigrateSftp = jsAfterMigrateSftp;
