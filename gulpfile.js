var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();
// var zip = require('gulp-zip');
var file = require('gulp-file');
var fs = require('fs');
var archiver = require('archiver');

var projectName = 'bb_project';

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome
  gulp.src([
      './node_modules/@fortawesome/**/*',
    ])
    .pipe(gulp.dest('./vendor'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Magnific Popup
  gulp.src([
      './node_modules/magnific-popup/dist/*'
    ])
    .pipe(gulp.dest('./vendor/magnific-popup'))

  // Scrollreveal
  gulp.src([
      './node_modules/scrollreveal/dist/*.js'
    ])
    .pipe(gulp.dest('./vendor/scrollreveal'))

  // nouislider
  gulp.src([
    './node_modules/nouislider/distribute/nouislider.min.js',
    './node_modules/nouislider/distribute/nouislider.min.css'
  ])
  .pipe(gulp.dest('./vendor/nouislider'))

});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

// JS
gulp.task('js', ['js:minify']);

// Default task
//gulp.task('default', ['css', 'js', 'vendor']);
gulp.task('default', ['vendor']);


// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', ['css', 'js', 'browserSync'], function() {
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./*.html', browserSync.reload);
});


gulp.task('archive:manifest', function() {
  file('manifest', 'apptype: blackbird', {src: true})
    .pipe(gulp.dest('appui'));
});

// gulp.task('archive:create', ['default','archive:manifest'], function() {
//   gulp.src(['index.html', 'LICENSE', 'appui/**', 'vendor/**', 'css/**', 'img/**', 'js/**'], {base: '.'})
//     .pipe(zip(projectName + '.vtz', {compress: true}))
//     .pipe(gulp.dest('dist'));
// });

function createArchive(directory, filename) {
  if (!fs.existsSync(directory)) { fs.mkdirSync(directory); }
  var output = fs.createWriteStream(directory + '/' + filename);
  var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  archive.pipe(output);
  archive.directory('appui/','appui');
  archive.directory('vendor/', 'vendor');
  archive.directory('css/', 'css');
  archive.directory('img/', 'img');
  archive.directory('js/','js');
  archive.directory('config/','config');
  archive.file('index.html');
  archive.file('LICENSE');
  archive.finalize();
}

gulp.task('archive:create', ['default','archive:manifest'], function() {
  createArchive('./dist', projectName + '.zip');
  createArchive('./dist', projectName + '.vtz');
});
