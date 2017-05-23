
const gulp = require('gulp');

const mustache = require('./index.js');


gulp.task('view-object', function() {
	return gulp.src('test2/test.mustache')
		.pipe(mustache({
			title: 'View-Object',
			content: 'This should output one file, test.view-object.mustache, which should render normally'
		}, {extension: '.view-object.mustache'}))
		.pipe(gulp.dest('test2/dest'));
});

gulp.task('view-path', function() {
	return gulp.src('test2/test.mustache')
		.pipe(mustache('test2/view-path.json', {extension: '.view-path.mustache'}))
		.pipe(gulp.dest('test2/dest'));
});

gulp.task('template-path', function() {
	return gulp.src('test2/views/*.json')
		.pipe(mustache('test2/test.mustache', {extension: '.html'}))
		.pipe(gulp.dest('test2/dest'));
});

gulp.task('default', ['view-object', 'view-path', 'template-path']);
