"use strict";

var gulp = require('gulp'),
    less = require('gulp-less'),
    wiredep = require('wiredep').stream,    /*bower自动引入*/
    inject = require('gulp-inject'),        /*css，js自动引入*/
    browserSync = require('browser-sync').create(), /*监控文件变动，刷新*/
    lessImport = require('gulp-less-import');   /*less文件合到一个文件中*/


/**
 * 编译less
 */
gulp.task('less', ['mergeLess'], function () {
    return gulp.src('app/styles/less/xui.less')
        .pipe(less())
        .pipe(gulp.dest('app/styles/css'));
})

/**
 * less文件引入一个文件中
*/
gulp.task('mergeLess', function () {
    return gulp.src('app/styles/less/**.less')
        .pipe(lessImport('app/styles/less/xui.less'))
        .pipe(gulp.dest('./'));
})

/**
 * 注入bower插件到index中
 */
gulp.task('bower', function () {
    gulp.src('app/index.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest('app'))
})

/**
 * 注入用户css和js到index文件中
*/
gulp.task('inject-css-js', ['less'], function () {
    var target = gulp.src('app/index.html');
    var sources = gulp.src(['app/vendor/**/*.js', 'app/pages/**/*.js', 'app/styles/css/xui.css', 'app/pages/**/*.css'], { read: false });
    return target.pipe(inject(sources))
        .pipe(gulp.dest('app'));
});


/**
 * 文件监听
*/
gulp.task('serve', ['bower', 'inject-css-js'], function () {
    browserSync.init({
        server: {
            files: ['**'],
            baseDir: './',
            index: 'app/index.html',
            browser: "google chrome"
        }
    });

    /*监听html,css和js文件的修改变动*/
    gulp.watch(['app/vendor/**/*.js', 'app/pages/**/*.js', 'app/styles/**/*.css', 'app/pages/**/*.css'], ['inject-css-js']);
    gulp.watch('app/**/*.html').on('change', browserSync.reload);
});


/**
 * 启动
*/
gulp.task('default', ['bower', 'inject-css-js', 'serve']);


/**
 * 文件打包
*/
