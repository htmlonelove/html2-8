import path from 'path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import htmlmin from 'gulp-htmlmin';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'postcss-csso';
import squoosh from 'gulp-squoosh';
import { deleteAsync } from 'del';
import svgo from "gulp-svgmin";
import { stacksvg } from "gulp-stacksvg";


// Styles
export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(gulp.dest('build', { sourcemaps: '.' }))
    .pipe(browser.stream());
};

// HTML
export const html = () => {
  return gulp.src('source/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
    .pipe(browser.stream());
};

// Images
export const copyPngJpg = () => {
  return gulp.src(['source/img/**/*.{png,jpg}'])
    .pipe(gulp.dest('build/img'))
};
export const optimizePngJpg = () => {
  return gulp.src(['source/img/**/*.{png,jpg}'])
    .pipe(squoosh(({ filePath }) => {
      const imageExtension = path.extname(filePath);
      const optionsForPng = { oxipng: {} };
      const optionsForJpg = { mozjpeg: {} };
      const options = imageExtension === ".png" ? optionsForPng : optionsForJpg;
      return {
        encodeOptions: options,
      };
    }
    ))
    .pipe(gulp.dest('build/img'))
};


// WebP
export const createWebp = () => {
  return gulp.src(['source/img/*.{png,jpg}'])
    .pipe(squoosh({
      encodeOptions: {
        webp: {}
      }
    }))
    .pipe(gulp.dest('build/img'))
};

// SVG
export const optimizeSvg = () => {
  return gulp.src(['source/img/**/*.svg'])
    .pipe(
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          },
          {
            name: 'cleanupIDs',
            active: false
          }
        ]
      }))
    .pipe(gulp.dest('build/img'))
};

export const spriteSvg = () => {
  return gulp.src(['source/img/icons/*.svg'])
    .pipe(
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          },
          {
            name: 'cleanupIDs',
            active: false
          }
        ]
      })
    )
    .pipe(stacksvg({ output: 'stack', separator: '__', spacer: '-' }))
    .pipe(gulp.dest('build/img'))
};

// Copy Icons
export const copyIco = (done) => {
  gulp.src([
    '/*.ico',
    '/*.webmanifest'
  ], {
    base: ''
  })
    .pipe(gulp.dest('build/'));
  done();
};

// Copy Fonts
export const copyFonts = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}'
  ])
    .pipe(gulp.dest('build/fonts'));
  done();
};

// Clean
export const clean = async () => {
  return await deleteAsync(['build']);
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    browser: 'chrome'
  });
  done();
};

// Reload
const reload = (done) => {
  browser.reload();
  done();
};

// Watcher
const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/index.html', gulp.series(html));
};


// Build
export const build = gulp.series(
  clean,
  copyIco,
  copyFonts,
  optimizePngJpg,
  gulp.parallel(
    styles,
    html,
    optimizeSvg,
    spriteSvg,
    createWebp
  ),
);

// Default
export default gulp.series(
  clean,
  copyIco,
  copyFonts,
  copyPngJpg,
  gulp.parallel(
    styles,
    html,
    optimizeSvg,
    spriteSvg,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
