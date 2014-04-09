'use strict';

var gulp = require('gulp');

var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap-amd');

var paths = {
	scripts: ['src/**/*.js']
};

gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
	    .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build'))
		.pipe(wrap({
			deps: ['jquery'],
			params: ['$'],
			exports: 'SPFormsExt'
		}))
		.pipe(rename({suffix: '.amd'}))
		.pipe(gulp.dest('build'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts']);