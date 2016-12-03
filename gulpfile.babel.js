// Module variables.
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var gulpBabel = require('gulp-babel');
var gulpServer = require('http-server');
var gulpCompass = require('gulp-compass');
var gulpConcat = require('gulp-concat');
var gulpImageMin = require('gulp-imagemin');
var gulpjsHint = require('gulp-jshint');
var gulpOpen = require('gulp-open');
var gulpPlumber = require('gulp-plumber');
var gulpRename = require('gulp-rename');
var gulpScss = require('gulp-sass');
var gulpHTMLmin = require('gulp-htmlmin');
var gulpAutoPrefixer = require('gulp-autoprefixer');
var gulpNano = require('gulp-cssnano');
var del = require('del');
var gulpCache = require('gulp-cache');
var gulpUglify = require('gulp-uglify');
var http = require('http');
var port = 3000;
// Directory variables.
var cssPath = "src/assets/styles/css/";
var scssPath = "src/assets/styles/scss/";
var jsPath = "src/assets/js/main/";
var jsPath2 = "src/assets/js/es6/";
var minJsPath = 'src/assets/js/main/min/';
var minCssPath = 'src/assets/styles/css/min/';
var minImgPath = 'src/assets/img/min/';
var imgPath = "src/assets/img/";
var htmlPath = "src/";
var minHtmlPath = 'src/min/';

// File variables.
var compassConfig = './config.rb';
var mainScssFile = 'mainstyle.scss';
var cssFile = 'mainstyle.css';
var jsFile = 'main.js';
var jsFile2 = 'maines6.js';
var html = 'index.html';
var anyJsFile = jsPath + '**/*.js';
var anyJsFile2 = jsPath2 + '**/*.js';
var anyHtmlFile = htmlPath + "**/*.html";
var anyMinJsFile = minJsPath + '**/*.min.js';
var anyCssFile = cssPath + '**/*.css';
var anyScssFile = scssPath + '**/*.scss';
var anyImgFile = imgPath + '**/*.*';
var notMinJsFile = '!src/assets/js/**/*.min.js';
var notMinCssFile = '!src/assets/styles/css/**/*.min.css';
var notMinHtmlFile = '!src/**/*.min.html';
var notMinImgFile = '!src/assets/img/**/*.min.*';

// /////////////////////////////////////
// SCSS to CSS Task
// /////////////////////////////////////

// create a task that converts scss files into css files

gulp.task('styles', function() {
  gulp.src(scssPath + mainScssFile)
  .pipe(gulpPlumber())
  .pipe(gulpCompass({
    config_files: compassConfig,
    css: cssPath,
    sass: scssPath
  }))
  .pipe(gulpAutoPrefixer('last 2 versions'))
  .pipe(gulp.dest(cssPath))
  .pipe(browserSync.stream());
});

// /////////////////////////////////////
// Minify CSS Task
// /////////////////////////////////////

// create a task that minifies all css files

gulp.task('minicss', function() {
  gulp.src([anyCssFile, notMinCssFile])
  .pipe(gulpRename({
    suffix: '.min'
  }))
  .pipe(gulpNano())
  .pipe(gulp.dest(minCssPath))
  .pipe(browserSync.stream());
});

// /////////////////////////////////////
// JS5 to JS6 Task
// /////////////////////////////////////

// transpile ES2015 to ES5 using ES2015 preset

gulp.task('es6', function() {
  return gulp.src(jsPath2 + jsFile2)
        .pipe(gulpBabel({
          presets: ['es2015']
        }))
        .pipe(gulpRename({
          basename: 'main'
        }))
        .pipe(gulp.dest(jsPath))
        .pipe(browserSync.stream());
});

// /////////////////////////////////////
// Minify Javascript Task
// /////////////////////////////////////

// create a task that minifies javascript files

gulp.task('minijs', function() {
  gulp.src([anyJsFile, notMinJsFile])
  .pipe(gulpPlumber())
  .pipe(gulpRename({suffix:'.min'}))
  .pipe(gulpUglify())
  .pipe(gulp.dest(minJsPath))
  .pipe(browserSync.stream());
});

// /////////////////////////////////////////
// Minify HTML Task
// /////////////////////////////////////////

// create a task that minifies all html files

gulp.task('minihtml', function() {
  gulp.src([anyHtmlFile, notMinHtmlFile])
  .pipe(gulpPlumber())
  .pipe(gulpRename({
    suffix: '.min'
  }))
  .pipe(gulpHTMLmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest(minHtmlPath));
});

// /////////////////////////////////////////
// Minify Image Task
// /////////////////////////////////////////

// create a task that minifies all images

gulp.task('miniimg', function() {
  gulp.src([anyImgFile, notMinImgFile])
  .pipe(gulpPlumber())
  .pipe(gulpCache(gulpImageMin({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  })))
  .pipe(gulpRename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(minImgPath))
  .pipe(browserSync.stream());
});

// /////////////////////////////////////////
// Browser-sync Task
// /////////////////////////////////////////

gulp.task('syncBrowser', function() {
  browserSync.init({
    server: './src',
    notify: false
  });

// add broswerSync.reload to the tasks array to make all browsers reload after tasks are complete.
  gulp.watch(anyScssFile, ['styles']);
  gulp.watch([anyJsFile2], ['es6']);
  gulp.watch([anyCssFile, notMinCssFile], ['minicss']);
  gulp.watch([anyJsFile, notMinJsFile], ['minijs']);
  gulp.watch([anyHtmlFile, notMinHtmlFile]).on('change', browserSync.reload);
  gulp.watch([anyHtmlFile, notMinHtmlFile], ['minihtml']);
  gulp.watch([anyImgFile, notMinImgFile], ['miniimg']);
});

// /////////////////////////////////////////
// Default Task
// /////////////////////////////////////////

gulp.task('default', ['styles', 'minicss', 'es6', 'minijs', 'minihtml', 'miniimg', 'syncBrowser']);
