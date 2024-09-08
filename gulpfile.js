import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import plumber from 'gulp-plumber';

import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser'
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore'
import imagemin from 'gulp-imagemin';
import sourcemaps from "gulp-sourcemaps";
import webp from "gulp-webp"
import { deleteAsync } from "del"


import browser from 'browser-sync';

// Styles

const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemaps.write("."))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browser.stream());
}

// HTML
const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
}

// JS
const js = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
}

//Images
const optimizeImages = () => {
  return gulp.src(['source/img/**/*.{jpg,png,svg}', '!source/img/sprite.svg'])
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'))
}

export const moveSprite = () => {
  return gulp.src(['source/img/sprite.svg'])
    .pipe(gulp.dest('build/img'))
}

const copyMedia = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg,mp4}')
    .pipe(gulp.dest('build/img'))
}

const images2WebP = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*.png'])
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('build/img'))
}

// SVG

const makeSprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore())
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/icons'))
}

// Copy
const copy = (done) => {
  return gulp.src(['source/fonts/**/*.{woff2,woff}', 'source/*.ico'], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
}

// Clean
export const clean = (done) => {
  return deleteAsync('build')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// // Watcher

const reload = (done) => {
  browser.reload();
  done();
}

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(js))
  gulp.watch('source/*.html').on('change', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    html,
    js,
  )
)


export default gulp.series(
  clean,
  copy,
  copyMedia,
  gulp.parallel(
    html,
    styles,
    js,
    server,
    watcher
  )
);
