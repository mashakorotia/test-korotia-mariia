'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var version = require('gulp-version-number');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var fileinclude = require('gulp-file-include');
var productionPath = './production/';
var laravelPath = '../accord-limo-backend/public/';

gulp.task('sass', function() {
    return gulp
        .src(['src/sass/main.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build-dev/css'))
})

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./build-dev/"
    }
  });

  gulp.watch("./build-dev/*.html").on("change", reload);
  gulp.watch("./build-dev/css/*.css").on("change", reload);
  gulp.watch("./build-dev/js/*.js").on("change", reload);
});

gulp.task('cssmin:production', function() {
    return gulp.src(['./build-dev/css/main.css'])
        .pipe(concat('main.css'))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(productionPath + 'css/'))
})

gulp.task('concat', function() {
    return gulp
        .src([
          './src/js/jquery.js',
          './src/js/libraries/*.js',
          'src/js/custom.js'
        ])
        .pipe(concat('build.js'))
        .pipe(gulp.dest('build-dev/js/'))
})

gulp.task('compress:production', function() {
    return gulp
        .src('./build-dev/js/build.js')
        //.pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(productionPath + 'js/'))
})

gulp.task('watchTask', function() {
    gulp.watch('./src/sass/**/*.scss', {usePolling: true}, gulp.series('sass'));
    gulp.watch('./src/sass/**/*.sass', {usePolling: true}, gulp.series('sass'));
    gulp.watch('./src/js/**/*.js', {usePolling: true}, gulp.series('concat'));
    gulp.watch('./src/[^_]*.html', {usePolling: true}, gulp.series('html:build'));
    gulp.watch('./src/[^_]*.html', {usePolling: true}, gulp.series('html:build'));
    gulp.watch('./src/partails/**/*.html', {usePolling: true}, gulp.series('html:build'));
})

gulp.task('html:build', function () {
  return gulp.src('src/[^_]*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(version({
      'value' : '%MDS%',
      'append': {
        'key': 'v',
        'to': ['css', 'js'],
      }
    }))
    .pipe(gulp.dest('./build-dev/'));
});

gulp.task('assetsCopy', function() {
   return gulp.src(['./assets/**/*']).pipe(gulp.dest('./build-dev'))
})

gulp.task('assetsCopy:production', function() {
   return gulp.src(['./assets/*/*']).pipe(
        gulp.dest(productionPath)
    )
})


gulp.task('build:production', gulp.series('concat', 'sass','compress:production', 'cssmin:production'), function() {});

gulp.task('build:dev', gulp.series('html:build', 'concat', 'sass', 'assetsCopy'), function() {});

gulp.task('build:production-all', gulp.series('compress:production', 'cssmin:production', 'assetsCopy:production'), function() {});


gulp.task('laravel:copy', function () {
  return gulp.src(['./assets/**', './production/**']).pipe(gulp.dest(laravelPath));
});


gulp.task('laravel:build', gulp.series('build:production', 'laravel:copy'), function() {});

gulp.task('default', gulp.parallel('watchTask', 'browser-sync', 'html:build'), function() {});
