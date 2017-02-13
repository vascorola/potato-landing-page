// requires brew install homebrew/science/vips (https://github.com/lovell/sharp)

// Load plugins
var pkg          = require('./package.json'),
	autoprefixer = require('gulp-autoprefixer'),
	bytediff     = require('gulp-bytediff'),
	concat       = require('gulp-concat'),
	csso         = require('gulp-csso'),
	// del          = require('del'),
	gulp         = require('gulp'),
	gzip	     = require('gulp-gzip'),
	imagemin     = require('gulp-imagemin'),
	jshint       = require('gulp-jshint'),
	less         = require('gulp-less'),
	lessmap      = require('gulp-less-sourcemap'),
	mozjpeg      = require('imagemin-mozjpeg'),
	nano         = require('gulp-cssnano'),
	notify       = require('gulp-notify'),
	pngquant     = require('imagemin-pngquant'),
	rename	     = require('gulp-rename'),
	size	     = require('gulp-size'),
	sourcemaps   = require('gulp-sourcemaps'),
	gulpSharp    = require('gulp-sharp'),
	uglify       = require('gulp-uglify'),
	rsync        = require('gulp-rsync'),
	zopfli       = require('gulp-zopfli');

	// cache        = require('gulp-cached'),
	// progeny      = require('gulp-progeny'),
	// merge        = require('merge-stream'),
	// browserSync  = require('browser-sync').create(),
	// lazypipe     = require('lazypipe');

// Configurable paths
var config = {
	app: 'src',
	dist: 'dist',
	vendor: '_app/vendor',
	assets: '_app',
	bootstrap: '_app/vendor/bootstrap'

	// scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
	// images: 'client/img/**/*'
};

// Javascript files to be concatenated and minified by order
var jsFileList = [
	'./src/vendor/jquery/dist/jquery.min.js',
	// './src/vendor/bootstrap/js/transition.js',
	// './src/vendor/bootstrap/js/alert.js',
	// './src/vendor/bootstrap/js/button.js',
	// './src/vendor/bootstrap/js/carousel.js',
	// './src/vendor/bootstrap/js/collapse.js',
	// './src/vendor/bootstrap/js/dropdown.js',
	// './src/vendor/bootstrap/js/modal.js',
	// './src/vendor/bootstrap/js/tooltip.js',
	// './src/vendor/bootstrap/js/popover.js',
	// './src/vendor/bootstrap/js/scrollspy.js',
	// './src/vendor/bootstrap/js/tab.js',
	// './src/vendor/bootstrap/js/affix.js',
    './src/vendor/cocoen/dist/js/cocoen.min.js',
    './src/vendor/lightslider/dist/js/lightslider.min.js',
	'./src/js/plugins/*.js',
	'./src/js/js/_*.js'
];


gulp.task('default', ['less', 'js', 'png', 'mozjpeg', 'compress']);

gulp.task('less', function () {
   console.log('Running less task...');
   return gulp.src('./src/less/main.less')
	.pipe(less())
	 .pipe(autoprefixer())
	 .pipe(bytediff.start())
		 .pipe(nano({autoprefixer:false}))
		 .pipe(rename({suffix: ".min"}))
		 .pipe(gulp.dest('./dist/css'))
	 .pipe(bytediff.stop());
 });

gulp.task('js', function() {
	console.log('Building Javascript files...');
	return gulp.src(jsFileList)
		.pipe(sourcemaps.init())
			.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(bytediff.start())
		.pipe(uglify())
		.pipe(bytediff.stop())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/js/'));
});

// Compress JS and CSS files in dist folder
gulp.task('compress', function() {
	gulp.src(['./dist/js/*.min.js', './dist/css/*.min.css'], { base: "./" })
		.pipe(bytediff.start())
		.pipe(zopfli({ append: true })) // zopfli beats gzip compression
		.pipe(bytediff.stop())
		.pipe(gulp.dest('.'))
		.pipe(notify("Finished compressing CSS and JS."));
});

// Compress JPEG Images
gulp.task('mozjpeg', function () {
	gulp.src(['./src/img/**/*.jpg', '!./src/img/**/*-o.jpg']) // optimiza jpegs não pré-optimizados
		.pipe(bytediff.start())
			.pipe(mozjpeg({quality: 78, tune: 'ms-ssim'})())
			.pipe(rename({suffix: '-o'}))
		.pipe(gulp.dest('./dist/img'))
		.pipe(bytediff.stop());
	gulp.src('./src/img/**/*-o.jpg').pipe(gulp.dest('./dist/img')); // copiar jpegs pré-optimizados

});

// Compress PNG Images
gulp.task('png', function () {
	gulp.src(['./src/img/**/*.png', '!./src/img/**/*-o.png', '!./src/img/appicon/*.png']) // optimiza pngs não pré-optimizados
		.pipe(bytediff.start())
			.pipe(imagemin({
				progressive: true,
				use: [pngquant({speed:1, posterize:4, floyd:0.3, quality:25-40})]
                // use: [pngquant({speed:1, posterize:3, floyd:0.2, quality:30-50})] // para mais qualidade
			}))
		.pipe(bytediff.stop())
		.pipe(rename({suffix: '-o'}))
		.pipe(gulp.dest('./dist/img'));
		gulp.src('./src/img/**/*-o.png').pipe(gulp.dest('./dist/img')); // copiar pngs pré-optimizados
    
    // App Icons
    gulp.src(['./src/img/appicon/*.png', '!./src/img/appicon/*-o.png']) // optimiza pngs não pré-optimizados
		.pipe(bytediff.start())
			.pipe(imagemin({
				progressive: true,
				use: [pngquant({speed:1, posterize:4, floyd:0.3, quality:25-40})]
                // use: [pngquant({speed:1, posterize:3, floyd:0.2, quality:30-50})] // para mais qualidade
			}))
		.pipe(bytediff.stop())
		.pipe(gulp.dest('./dist/img/appicon'));
});

// for sourcemaps
gulp.task('lessdev', function () {
   console.log('Running less task...');
   return gulp.src('./src/less/main.less')
	 .pipe(lessmap({sourceMap: {sourceMapFileInline: true}}))
	 //.pipe(autoprefixer()) // atenção: autoprefixer não funciona com less-sourcemaps
		 //.pipe(nano()) // atenção: autoprefixer não funciona com less-sourcemaps
		 .pipe(rename({suffix: ".min"}))
		 .pipe(gulp.dest('./dist/css'))
 });