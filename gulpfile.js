var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    envify = require('envify/custom'),
    less = require('gulp-less'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    csswring = require('csswring');

var path = {
  OUT: 'bundle.js',
  DEST: './public',
  ENTRY_POINT: './client/main.js'
}

/**
 * To build, create bundle.js and style.css
 */
gulp.task('build', ['browserify', 'less']);

/**
 * Create and minify bundle.js
 */
gulp.task('browserify', function () {
  // process.env['NODE_ENV'] = 'production';
  return browserify(path.ENTRY_POINT)
    .transform(babelify.configure())
    .transform(envify({ NODE_ENV: 'production' }))
    .bundle()
    .pipe(source(path.OUT))  // gives streaming vinyl file object
    .pipe(buffer())          // convert from streaming to buffered vinyl file object
    .pipe(uglify())          // minify dat code
    .pipe(gulp.dest(path.DEST));
});

/**
 * Convert all less into minified autoprefixed css
 */
gulp.task('less', function () {
  return gulp.src('./client/**/*.less')
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csswring.postcss
    ]))
    .pipe(gulp.dest(path.DEST));
});

/**
 * In dev mode, watch for changes in client code and Less and
 * rebuild bundle.js or style.css when these happen
 */
gulp.task('dev', function () {
  gulp.watch(['./client/**/**.less'], ['less']);

  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [babelify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST))
  }).bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST));
});