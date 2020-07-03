const {src, dest, lastRun} = require ('gulp');

const config = require ('./../config.json');
const project = config.project;
const root = config.root;
const sftpcon = config.sftp;
const ftp = config.ftp;
const taskswitch = config.taskswitch;
const sassStyle = config.sassStyle;

const rename = require ('gulp-rename');
const plumber = require ('gulp-plumber');
const sass = require ('gulp-sass');
const compass = require ('gulp-compass');
const postcss = require ('gulp-postcss');
const autoprefixer = require ('autoprefixer');
const progeny = require ('gulp-progeny');
const gulpif = require ('gulp-if');
const changed = require ('gulp-changed');

const purgecss = require ('gulp-purgecss');

// const sftp = require('gulp-sftp-up4');
const sftp = require ('gulp-ssh');
const vftp = require ('vinyl-ftp');
const conn = vftp.create (ftp);
const sftpconfig = {
  host: sftpcon.host,
  username: sftpcon.user,
  password: sftpcon.pass,
  port: sftpcon.port,
};

var gulpSSH = new sftp ({
  ignoreErrors: false,
  sshConfig: sftpconfig,
});
const sftpSwitch = taskswitch.sftp,
  ftpSwitch = taskswitch.ftp,
  sassexp = sassStyle.sassexp,
  sassmin = sassStyle.sassmin,
  sassCompass = sassStyle.sassCompass,
  csspurge = taskswitch.csspurge;

// local環境のsassコンパイルタスク  *********************
function sassComplie () {
  if (sassCompass) {
    return src (root.projectDir + project.sasssrcDir + '/**/*.scss', {
      since: lastRun (sassComplie),
    })
      .pipe (progeny ())
      .pipe (
        plumber ({
          errorHandler: function (err) {
            console.log (err + err.messageFormatted);
            this.emit ('end');
          },
        })
      )
      .pipe (
        compass ({
          sass: root.projectDir + project.sasssrcDir,
          css: root.projectDir + project.sassdstDir,
          config_file: root.projectDir +
            project.compassDir +
            project.configfile,
        })
      )
      .pipe (dest (root.changeDir + project.beforepurgeDir));
  } else {
    return src (root.projectDir + project.sasssrcDir + '/**/*.scss', {
      since: lastRun (sassComplie),
    })
      .pipe (progeny ())
      .pipe (
        plumber ({
          errorHandler: function (err) {
            console.log (err.messageFormatted);
            this.emit ('end');
          },
        })
      )
      .pipe (
        gulpif (
          sassexp,
          sass ({
            outputStyle: 'expanded',
          }).on ('error', sass.logError)
        )
      )
      .pipe (
        gulpif (
          sassmin,
          sass ({
            outputStyle: 'compressed',
          }).on ('error', sass.logError)
        )
      )
      .pipe (
        postcss ([
          autoprefixer ({
            overrideBrowserslist: [
              'last 2 versions',
              'ie >= 11',
              'Android >= 4',
            ],
            cascade: false,
          }),
        ])
      )
      .pipe (
        gulpif (
          sassmin,
          rename ({
            suffix: '.min',
          })
        )
      )
      .pipe (dest (root.changeDir + project.beforepurgeDir));
  }
}
function sassSftp () {
  return src (root.projectDir + project.sasssrcDir + '/**/*.scss')
    .pipe (changed (root.changeDir + project.sasssrcDir))
    .pipe (dest (root.changeDir + project.sasssrcDir))
    .pipe (gulpSSH.dest (root.uploadDir + project.sasssrcDir));
}
function sassFtp () {
  return src (root.projectDir + project.sasssrcDir + '/**/*.scss')
    .pipe (changed (root.changeDir + project.sasssrcDir))
    .pipe (dest (root.changeDir + project.sasssrcDir))
    .pipe (gulpif (ftpSwitch, conn.dest (root.uploadDir + project.sassdstDir)));
}
function cssFunc () {
  return src (root.changeDir + project.beforepurgeDir + '/**/*.css')
    .pipe (
      gulpif (
        csspurge,
        purgecss ({
          content: [root.projectDir + project.purgeContentFiles],
          whitelistPatterns: [/.*is/],
          whitelistPatternsChildren: [/.*is/],
        })
      )
    )
    .pipe (dest (root.changeDir + project.sassdstDir))
    .pipe (changed (root.changeDir + project.beforepurgeDir))
    .pipe (dest (root.projectDir + project.sassdstDir))
    .pipe (gulpif (ftpSwitch, conn.dest (root.uploadDir + project.sassdstDir)));
}
function cssFuncSftp () {
  return src (root.changeDir + project.beforepurgeDir + '/**/*.css')
    .pipe (
      gulpif (
        csspurge,
        purgecss ({
          content: [root.projectDir + project.purgeContentFiles],
          whitelistPatterns: [/.*is/],
          whitelistPatternsChildren: [/.*is/],
        })
      )
    )
    .pipe (dest (root.changeDir + project.sassdstDir))
    .pipe (changed (root.changeDir + project.beforepurgeDir))
    .pipe (dest (root.projectDir + project.sassdstDir))
    .pipe (gulpSSH.dest (root.uploadDir + project.sassdstDir));
}

// タスクの定義？  *********************
exports.sassComplie = sassComplie;
exports.sassSftp = sassSftp;
exports.sassFtp = sassFtp;
exports.cssFunc = cssFunc;
exports.cssFuncSftp = cssFuncSftp;
