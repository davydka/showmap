var gulp = require('gulp')
	, nodemon = require('gulp-nodemon')
	, browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('default', function() {
	nodemon({
		script: 'index.js'
		, ext: 'js html'
		, env: { 'NODE_ENV': 'development' }
	});

	browserSync({
		notify: false,
		port: 5000,
		server: {
			baseDir: ['.tmp', 'app'],
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	});
});
