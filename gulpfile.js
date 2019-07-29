var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

    var path = {
        build: { //Тут мы укажем куда складывать готовые после сборки файлы
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            img: 'build/img/',
            fonts: 'build/fonts/'
        },
        src: { //Пути откуда брать исходники
            html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
            js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
            style: 'src/scss/main.scss',
            img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
            fonts: 'src/fonts/**/*.*'
        },
        watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
            html: 'src/**/*.html',
            js: 'src/js/**/*.js',
            style: 'src/scss/**/*.scss',
            img: 'src/img/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        clean: './build'
    };

    var config = {
        server: {
            baseDir: "./build"
        },
        tunnel: true,
        host: 'localhost',
        port: 3000,
        logPrefix: "Frontend_Devil"
    };

    // собирем html
    gulp.task('html:build', function () {
        gulp.src('src/index.html') //Выберем файлы по нужному пути
            .pipe(rigger()) //Прогоним через rigger
            .pipe(gulp.dest('build/index.html')) //Выплюнем их в папку build
            .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
    });

     // собирем js
    gulp.task('js:build', function () {
        gulp.src('src/js/main.js') //Найдем наш main файл
            .pipe(rigger()) //Прогоним через rigger
            .pipe(sourcemaps.init()) //Инициализируем sourcemap
            .pipe(uglify()) //Сожмем наш js
            .pipe(sourcemaps.write()) //Пропишем карты
            .pipe(gulp.dest('build/js')) //Выплюнем готовый файл в build
            .pipe(reload({stream: true})); //И перезагрузим сервер
    });

    // собирем scss
    gulp.task('scss:build', function () {
        gulp.src('src/scss/main.scss') //Выбираем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css')) //И в build
        .pipe(reload({stream: true}));
    });

    gulp.task('image:build', function () {
        gulp.src('src/img/*.png') //Выберем наши картинки
            .pipe(imagemin({ //Сожмем их
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest('build/img')) //И бросим в build
            .pipe(reload({stream: true}));
    });