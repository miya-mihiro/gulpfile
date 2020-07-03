const { src, dest, series, watch, lastRun, parallel } = require('gulp');

const config = require('./../config.json');
const project = config.project;
const root = config.root;
const sftpcon = config.sftp;
const ftp = config.ftp;
const taskswitch = config.taskswitch;

const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const imageminPng = require('imagemin-pngquant');
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

const sftpSwitch = taskswitch.sftp,
  ftpSwitch = taskswitch.ftp;

// local環境のimg圧縮タスク *********************
function imgUpload() {
  return src(
    root.projectDir + project.imgsrcDir + '/**/*.+(jpg|jpeg|png|gif|svg)'
  )
    .pipe(changed(root.changeDir + project.imgsrcDir))
    .pipe(dest(root.changeDir + project.imgsrcDir))
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir + project.imgsrcDir)));
}
function imgUploadSftp() {
  return src(
    root.projectDir + project.imgsrcDir + '/**/*.+(jpg|jpeg|png|gif|svg)'
  )
    .pipe(changed(root.changeDir + project.imgsrcDir))
    .pipe(dest(root.changeDir + project.imgsrcDir))
    .pipe(gulpSSH.dest(root.uploadDir + project.imgsrcDir));
}
function imgMin() {
  return src(
    root.projectDir + project.imgsrcDir + '/**/*.+(jpg|jpeg|png|gif|svg)'
  )
    .pipe(changed(root.changeDir + project.imgsrcDir))
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir + project.imgsrcDir)))
    .pipe(
      imagemin([
        mozjpeg({ quality: 80, progressive: true }),
        imageminPng({ optimizationLevel: 5 }),
        imagemin.gifsicle(),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(root.projectDir + project.imgdstDir))
    .pipe(dest(root.changeDir + project.imgdstDir))
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir + project.imgdstDir)));
}
function imgMinSftp() {
  return src(
    root.projectDir + project.imgsrcDir + '/**/*.+(jpg|jpeg|png|gif|svg)'
  )
    .pipe(changed(root.changeDir + project.imgsrcDir))
    .pipe(gulpif(ftpSwitch, conn.dest(root.uploadDir + project.imgsrcDir)))
    .pipe(
      imagemin([
        mozjpeg({ quality: 80, progressive: true }),
        imageminPng({ optimizationLevel: 5 }),
        imagemin.gifsicle(),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(root.projectDir + project.imgdstDir))
    .pipe(dest(root.changeDir + project.imgdstDir))
    .pipe(gulpSSH.dest(root.uploadDir + project.imgdstDir));
}

exports.imgMin = imgMin;
exports.imgUpload = imgUpload;
exports.imgUploadSftp = imgUploadSftp;
exports.imgMinSftp = imgMinSftp;
