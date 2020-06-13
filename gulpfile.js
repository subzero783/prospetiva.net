//  Gulp file
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceSting: /\bgulp[\-.]/
});

var reload  = browserSync.reload;

// Error handler for plumber
const onError = function(err) {
	console.log(err);
};

// Concat + Minifiy Js Files and move to vendor folder
var jsFiles = [ 'assets/js/plugins/*.js' ];
var jsDest = 'assets/js/';

gulp.task('combineJS', function () {
	return gulp.src(jsFiles)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.plumber({ errorHandler: onError }))
		.pipe(plugins.order([
			'jquery.min.js',
			'bootstrap.bundle.min.js',
			'jquery.waitforimages.min.js',
			'jquery.waypoints.min.js',
			'hoverIntent.js',
			'*.js',
		]))
		.pipe(plugins.concat('plugins.js'))
		.pipe(gulp.dest(jsDest))
		.pipe(plugins.rename({ suffix:'.min' }))
		.pipe(plugins.uglify())
		.pipe(plugins.plumber.stop())
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(jsDest));
});

// Css
// Concat + Minifiy Css Files and move to vendor folder
var cssFiles = 'assets/css/plugins/*.css';
var cssDest = 'assets/css/';

gulp.task('combineCSS', function () {
	return gulp.src(cssFiles)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.plumber({ errorHandler: onError }))
		.pipe(plugins.order([
			'bootstrap.css',
			'*.css'
		]))
		.pipe(plugins.concat('plugins.css'))
		.pipe(gulp.dest(cssDest))
		.pipe(plugins.rename({ suffix:'.min' }))
		.pipe(plugins.cssmin({keepBreaks: true, keepSpecialComments : '*' }))
		.pipe(plugins.plumber.stop())
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(cssDest));
});

gulp.task('build', ['combineCSS', 'combineJS'], function() {
	// Copy Extra Things
	return;
});

// Sass
var sassFile = 'assets/sass/**/*.scss';
var sassDest = 'assets/css/';
gulp.task('sass', function () {
	return gulp.src(sassFile)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.plumber({ errorHandler: onError }))
		.pipe(plugins.sass({outputStyle: 'expanded'})) // expanded - compressed - compact - nested
		.pipe(plugins.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(plugins.plumber.stop())
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(sassDest))
        .pipe(reload({ stream: true }));
});

// call - gulp htmlmin
// minify Html files  
// this will make your html files minified 
// make sure to copy all html files before using this
gulp.task('htmlmin', function () {
	return gulp.src('*.html')
		.pipe(plugins.plumber({ errorHandler: onError }))
	    .pipe(plugins.htmlmin({
	    	collapseWhitespace: true,
	    	removeComments: true,
	    	minifyJS: true, // minify js too
	    	minifyCSS: true // minify css too
	    }))
	    .pipe(plugins.plumber.stop())
	    .pipe(gulp.dest('miniHTML/'));
});

// Images - Optimize jpeg and png images
gulp.task('imagemin', function () {
	return gulp.src('assets/images/**/*')
		.pipe(plugins.plumber({ errorHandler: onError }))
	    .pipe(imagemin({
            interlaced: true
        }))
	    .pipe(plugins.plumber.stop())
	    .pipe(gulp.dest('assets/images'));
});

// Es6 to Es5
gulp.task('babel', () => {
    return gulp.src(['assets/js/es6/*.js'])
		.pipe(plugins.plumber({ errorHandler: onError }))
        .pipe(plugins.babel({
            presets: ['@babel/env']
        }))
	    .pipe(plugins.plumber.stop())
        .pipe(gulp.dest('assets/js/'))
        .pipe(reload({ stream: true }))
});

// Sync - Livereload
gulp.task('browser-sync', ['sass'], function () {
	browserSync.init({
		proxy: 'http://prospetiva.localhost'
	});

	// watch scss files
	gulp.watch(['assets/sass/*.scss', 'assets/sass/**/*.scss'], ['sass']);

	gulp.watch([
		'*.html',
		'*.php',
		'*.js'
	]).on('change', reload);
});

// Default Task
gulp.task('default', ['browser-sync']);