// Modules
const  autoprefixer = require('autoprefixer'),
            browser      = require('browser-sync').create(),
            cssnano      = require('cssnano'),
            del          = require('del'),
            gulp         = require('gulp'),
            imagemin     = require('gulp-imagemin'),
            nunjucks     = require('gulp-nunjucks-render'),
            postcss      = require('gulp-postcss'),
            rename       = require('gulp-rename'),
            sass         = require('gulp-sass');

// Paths
const   paths = {
        dest: 'dist',
        html:   {
            src: 'src/pages/**/*.njk',
            njk: 'src/templates',
            watch: 'src/**/*.njk'
        },
        css: {
            src: 'src/scss/**/*.scss',
            dest: 'dist/css'
        },
        fonts: {
            css: 'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
            src: 'node_modules/@fortawesome/fontawesome-free/webfonts/*',
            dest: 'dist/webfonts'

        },
        img: {
            src: 'src/img/**/*{png,jpg,gif,svg,ico}',
            dest: 'dist/img'
        },
        js: {
            src: 'src/js/*',
            dest: 'dist/js',
            jquery: 'node_modules/jquery/dist/jquery.slim.min.js',
            popper: 'node_modules/popper.js/dist/umd/popper.min.js',
            bootjs: 'node_modules/bootstrap/dist/js/bootstrap.min.js'
        }
}

//Clean
async function clean(cb) {
    return del(paths.dest)
    cb();
}

// HTML
async function html() {
    return gulp
        .src(paths.html.src)
        .pipe(nunjucks({
            path: [paths.html.njk]
        }))
        .pipe(gulp.dest(paths.dest))
        .pipe(browser.stream());
}

// CSS
async function css() {
    var plugins = [
        autoprefixer(),
        cssnano()
    ];
    return gulp
        .src(paths.css.src)
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(postcss(plugins))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browser.stream());
        cb();
}

// Fontawesome CSS
async function fontawesome(cb) {
    return gulp
        .src(paths.fonts.css)
        .pipe(rename('fontawesome-all.min.css'))
        .pipe(gulp.dest(paths.css.dest));
        cb();
}
// Fontawesome webfonts
async function webfonts(cb) {
    return gulp
        .src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
    cb();
}

// JS files
async function js(cb) {
    return gulp
        .src([
            paths.js.jquery,
            paths.js.popper,
            paths.js.bootjs
        ], {allowEmpty:true})
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browser.stream());
        cb();
}

// Images
async function img(cb) {
    return gulp
        .src(paths.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest))
        .pipe(browser.stream());
        cb();
}

// Watch
async function watch() {
return     gulp.watch(paths.html.watch, html);
                gulp.watch(paths.css.src, css);
                gulp.watch(paths.js.src, js);
                gulp.watch(paths.img.src, img);
}

// Server
async function server(cb) {
    return browser.init({
        server: paths.dest
    })
    cb();
}

// Export tasks
exports.css = css;
exports.img = img;
exports.js = js;
exports.watch = gulp.parallel(watch, server);
exports.default = gulp.series( clean, gulp.parallel(html, css, fontawesome, webfonts, js, img), server, watch);
