const { series, src, dest, parallel } = require('gulp');
const browserify = require('browserify');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

const paths = {
  pages: ['./*.html']
};

function test2() {
  return src(paths.pages)
    .pipe(dest('dist'));
};

function test1() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/index.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform('babelify', {
      presets: ["@babel/preset-env"],
      extensions: ['.ts']
    })
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('dist'));
};

const minifyCSS = () => {
  return src('./src/*.css')
    .pipe(cleanCSS())
    .pipe(concat('index.css'))
    .pipe(dest('dist'));
};

exports.default = series(parallel(test2, test1, minifyCSS));
