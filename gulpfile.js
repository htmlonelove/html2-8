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
import terser from 'gulp-terser';


// Styles
export const styles = () => {
  return gulp.src('less/style.less', { sourcemaps: true })
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
  return gulp.src('index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
    .pipe(browser.stream());
};

// Scripts
export const scripts = () => {
  return gulp.src('js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
};

// Images
export const copyPngJpg = () => {
  return gulp.src(['img/**/*.{png,jpg}'])
    .pipe(gulp.dest('build/img'))
};
export const optimizePngJpg = () => {
  return gulp.src(['img/**/*.{png,jpg}'])
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

export const optimizeSvgFavicon = () => {
  return gulp.src(['favicon/*.svg'])
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
    .pipe(gulp.dest('build/favicon'))
};

export const optimizePngFavicon = () => {
  return gulp.src(['favicon/*.png'])
    .pipe(squoosh(({ filePath }) => {
        return {
          encodeOptions: { oxipng: {} },
        };
      }
    ))
    .pipe(gulp.dest('build/favicon'))
};


// WebP
export const createWebp = () => {
  return gulp.src(['img/*.{png,jpg}'])
    .pipe(squoosh({
      encodeOptions: {
        webp: {}
      }
    }))
    .pipe(gulp.dest('build/img'))
};

// SVG
export const optimizeSvg = () => {
  return gulp.src(['img/**/*.svg'])
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

// Copy Fonts
export const copyFonts = (done) => {
  gulp.src([
    'fonts/**/*.{woff2,woff}'
  ])
    .pipe(gulp.dest('build/fonts'));
  done();
};

// Copy
export const copy = (done) => {
  gulp.src([
    '*.ico',
  ])
    .pipe(gulp.dest('build'));
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
  gulp.watch('less/**/*.less', gulp.series(styles));
  gulp.watch('index.html', gulp.series(html));
  gulp.watch('js/*.js', gulp.series(scripts));
};


// Build
export const build = gulp.series(
  clean,
  copyFonts,
  copy,
  optimizePngJpg,
  gulp.parallel(
    styles,
    html,
    scripts,
    optimizePngFavicon,
    optimizeSvgFavicon,
    optimizeSvg,
    createWebp
  ),
);

// Default
export default gulp.series(
  clean,
  copyFonts,
  copy,
  copyPngJpg,
  gulp.parallel(
    styles,
    html,
    scripts,
    optimizeSvg,
    optimizePngFavicon,
    optimizeSvgFavicon,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
