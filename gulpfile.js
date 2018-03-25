"use strict";

var gulp = require('gulp'),
    less = require('gulp-less'),
    wiredep = require('wiredep').stream,    //bower自动引入
    inject = require('gulp-inject'),       //css，js自动引入
    browserSync = require('browser-sync').create(), //监控文件变动，刷新
    lessImport = require('gulp-less-import'),   //less文件合到一个文件中
    uglify = require('gulp-uglify'),//压缩js
    htmlMin = require('gulp-htmlmin'),//压缩html
    minifyCss = require('gulp-clean-css'),//压缩CSS
    concat = require('gulp-concat'), //合并js和css
    domSrc = require('gulp-dom-src'),  //合并bower插件
    cheerio = require('gulp-cheerio');  //文件操作

/**
* less文件引入一个文件中
*/
gulp.task('mergeLess', function () {
    return gulp.src('app/styles/less/**.less')
        .pipe(lessImport('app/styles/less/xui.less'))
        .pipe(gulp.dest('./'));
});

/**
 * 编译less
 */
gulp.task('less', ['mergeLess'], function () {
    return gulp.src('app/styles/less/xui.less')
        .pipe(less())
        .pipe(gulp.dest('app/styles/css'));
});

/**
 * 注入bower插件到index中
 */
gulp.task('bower', function () {
    gulp.src('app/index.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest('app'));
});

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
gulp.task('watch', ['bower', 'inject-css-js'], function () {
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
 * 启动,测开发环境 -- 文件没有压缩，自动注入css和js文件
*/
gulp.task('serve', ['bower', 'inject-css-js', 'watch']);



/**
 * 压缩合并bower插件css
*/
gulp.task('bower-css', function () {
    return domSrc({ file: 'app/index.html', selector: 'link', attribute: 'href' })
        .pipe(concat('css/bower.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/'));
});

/**
 * 压缩合并bower插件js
*/
gulp.task('bower-js', function () {
    return domSrc({ file: 'app/index.html', selector: 'script', attribute: 'src' })
        .pipe(concat('js/bower.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

/**
 * 合并用户css文件
*/
gulp.task('custom-css', function () {
    return gulp.src(['app/styles/css/*.css', 'app/pages/**/*.css'])
        .pipe(concat('css/app.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/'));
});


/**
 * 合并用户js文件
*/
gulp.task('custom-js', function () {
    return gulp.src(['app/vendor/**/*.js', 'app/pages/**/*.js'])
        .pipe(concat('js/app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});


/**
 * 压缩html文件
 */
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('app/pages/**/*.html')
        .pipe(htmlMin(options))
        .pipe(gulp.dest('dist'));
});


/**
 * index页面特殊处理
 */
gulp.task('indexHtml', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('app/index.html')
        .pipe(htmlMin(options))
        .pipe(cheerio(function ($) {
            var _src = '<script src="dist/js/bower.min.js"></script><script src="dist/js/app.min.js"></script>',
                _link = '<link rel="stylesheet" href="dist/css/bower.min.css"><link rel="stylesheet" href="dist/css/app.min.css">';

            /*样式插入*/
            $('link').remove();
            $('head').prepend(_link);

            /* 循环删除具有src的脚本 */
            $('script').each(function () {
                if ($(this).attr('src')) {
                    $(this).remove();
                }
            });

            /*判断是否有script脚本，为了不影响执行，插入到执行脚本的前面*/
            if ($('script').length) {
                $('script').before(_src);
            } else {
                $('body').append(_src);
            }
        }))
        .pipe(gulp.dest('dist/'));
});

/**
 * 文件打包
*/
gulp.task('dist', ['bower', 'inject-css-js', 'bower-css', 'bower-js', 'custom-css', 'custom-js', 'html', 'indexHtml'], function () {
    console.log('-------------------------------');
    console.log('项目打包完成');
    console.log('-------------------------------');

    browserSync.init({
        server: {
            files: ['**'],
            baseDir: './',
            index: 'dist/index.html',
            browser: "google chrome"
        }
    });
});