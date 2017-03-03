const gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack-stream'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch');

gulp.task('webpack', function () {
    return gulp.src('eclipse-ui.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./dist'));
});

gulp.task('scripts', ['webpack'], function () {
    return gulp.src(['./dist/eclipse-ui.js'])
    .pipe(uglify({
        mangle: false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['scripts'], function () {
    gulp.watch(['*.js', './lib/*.js'], ['scripts']);
});

gulp.task('default', ['watch']);