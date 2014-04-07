'use strict';

var gulp = require('gulp');

var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var paths = {
	scripts: ['src/**/*.js']
};

gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
	    .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts']);