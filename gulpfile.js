const { series, src, dest, parallel } = require("gulp");
const browserify = require("browserify");
const tsify = require("tsify");
const sourcemaps = require("gulp-sourcemaps");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const tsconfig = require("./tsconfig.json");

const paths = {
  pages: ["./public/*"]
};

const outputName = {
  js: "index.js",
  css: "index.css"
};

function copyFiles() {
  return src(paths.pages).pipe(dest(tsconfig.compilerOptions.outDir));
}

function bundleJS() {
  return browserify({
    basedir: ".",
    debug: true,
    entries: ["src/index.ts"],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify, tsconfig.compilerOptions)
    .bundle()
    .pipe(source(outputName.js))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write(tsconfig.compilerOptions.mapRoot))
    .pipe(dest(tsconfig.compilerOptions.outDir));
}

const minifyCSS = () => {
  return src("./src/*.css")
    .pipe(cleanCSS())
    .pipe(concat(outputName.css))
    .pipe(dest(tsconfig.compilerOptions.outDir));
};

exports.default = series(parallel(copyFiles, bundleJS, minifyCSS));
