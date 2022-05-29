const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const ejs = require('gulp-ejs');
const pug = require('gulp-pug-3');
// const rename = require('gulp-rename');
const beautify = require('gulp-beautify');
const sync = require('browser-sync').create();
const babel = require('gulp-babel');
const browserify = require('browserify')
const source = require('vinyl-source-stream');

function defaultTask(cb) {
  cb();
}

const taskPug = () => {
  return src('resource/pug/*.pug')
    .pipe(pug({extension: 'html'}))
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(dest('public/'))
}

const taskEjs = () => {
  return src('resource/ejs/**/*.ejs')
    .pipe(ejs())
    // .pipe(rename({ extname: '.html'}))
    .pipe(dest('ejslic/'));
}

const taskSass = () => {
  return src('resource/sass/**/*.scss')
    .pipe(sass())
    .pipe(dest('public/css/'))
}

const taskBrowserSyncInit = () => {
  sync.init({
    server: 'public/'
  });
}
const taskBrowserSync = (cb) => {
  sync.reload();
  cb();
}

const taskBabel = () => {
  return src("resource/es2015/**/*.js")
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(dest("public/js/"))
}

const taskBrowserify = () => {
  return browserify("resource/es2015/main.js")
    .bundle()
    .pipe(source('main.bundle.js'))
    .pipe(dest("public/js/"))
}

exports.default = (cb) => {
  taskPug();
  taskSass();
  taskBabel();
  taskBrowserify();
  cb();
}

exports.watch = () => {
  taskBrowserSyncInit();
  watch('resource/pug/**/*.pug', series(taskPug, taskBrowserSync));
  watch('resource/sass/**/*.scss', series(taskSass, taskBrowserSync));
  watch('resource/es2015/**/*.js', series(taskBabel, taskBrowserSync));
    // watch('ejs/**/*.ejs', taskEjs);
}