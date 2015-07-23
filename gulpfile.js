var gulp = require("gulp");
var browserify = require("gulp-browserify");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename"); 
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");

var modulePath = "./module/";
var buildPath = "./build/";

gulp.task('default', ['browserify', 'scss'], function(){
    //
});

gulp.task('browserify', function(){
    gulp.src(modulePath + "main.js")
        .pipe(browserify())
        .pipe(uglify())
        .pipe(rename({
            basename: 'bundle',
            suffix: '.min'
        }))
        .pipe(gulp.dest(buildPath + 'js'));
});

gulp.task('scss', function(){
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + 'css'));
});