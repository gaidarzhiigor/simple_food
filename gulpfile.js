// src, dest присваиваем им все возможности gulp
// watch - слежение за файлами
// parallel - параллельный запуск процессов
// series - поочередный запуск процессов
const { src, dest, watch, parallel, series } = require("gulp");

// подключение плагинов конвертации sass/scss
const scss = require("gulp-sass")(require("sass"));
// подключение плагина для конкатинации (объединения файлов) и переименования файлов
const concat = require("gulp-concat");
// плагин для сжатия js файлов
const uglify = require("gulp-uglify-es").default;
// плагин автоматического обновления вэб-страницы при изменении index.html
const browserSync = require("browser-sync").create();
// плагин для вендерных префиксов для других браузеров
const autoprefixer = require("gulp-autoprefixer");
// плагин для удаления папки dist
const clean = require("gulp-clean");
// плагины обработки изображений, которые сохраняем в images/src
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
// плагин для кэша
const newer = require("gulp-newer");
// плагин для svg-sprite
const svgSprite = require("gulp-svg-sprite");
// плагины для конвертации шрифтов
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
// плагин include html файлов
const include = require("gulp-include");

// ф-ция преобразования sass/scss в style.min.css с проверкой автопрефиксов, обновление вэб-страницы при написании стилей
function styles() {
  // указываем путь к нашему файлу стилей scss
  return (
    src("app/scss/style.scss")
      // плагин для добавления префиксов для работы в браузерах
      .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] }))
      // плагин для объединения и переименования файлов в style.min.css
      .pipe(concat("style.min.css"))
      // автоматическое сжатие файла
      .pipe(scss({ outputStyle: "compressed" }))
      // указываем папку для вывода стилей из scss в app/css
      .pipe(dest("app/css"))
      // обновление страницы после написания стилей
      .pipe(browserSync.stream())
  );
}

// ф-ция для работы с файлами js
function scripts() {
  // указываем путь к нашему файлу js
  return (
    src([
      "node_modules/jquery/dist/jquery.js",
      "node_modules/mixitup/dist/mixitup.js",
      "app/js/main.js",
      // 'app/js/**/*.js',
      // '!app/js/main.min.js' - кроме файла
      // node_modules/swiper/swiper-bundle.js - пример подключения файлов, если их много
    ])
      // переименовываем файл js в main.min.js
      .pipe(concat("main.min.js"))
      // сжимаем файл
      .pipe(uglify())
      // указываем папку для вывода
      .pipe(dest("app/js"))
      // обновление страницы после написания скриптов
      .pipe(browserSync.stream())
  );
}

// ф-ция обработки изображений + плагин для кэш (сохраняем изображения изначально в images/src)
function images() {
  // прописываем путь ко всем изображениям, кроме svg изображений
  return (
    src(["app/images/src/*.*", "!app/images/src/*.svg"])
      // отслеживает, чтобы повторно не обрабатывались изображения
      .pipe(newer("app/images"))
      // задаем качество обработки изображения
      .pipe(avif({ quality: 50 }))

      // прописываем путь ко всем изображениям
      .pipe(src("app/images/src/*.*"))
      // отслеживает, чтобы повторно не обрабатывались изображения
      .pipe(newer("app/images"))
      .pipe(webp())

      // прописываем путь ко всем изображениям
      .pipe(src("app/images/**/.*"))
      // отслеживает, чтобы повторно не обрабатывались изображения
      .pipe(newer("app/images"))
      .pipe(imagemin())

      // вывод обработанных изображений в папку app/images
      .pipe(dest("app/images"))
  );
}

// ф-ция для svg-sprite (объединение нескольких файлов SVG)
function sprite() {
  // находим обработанные картинки svg
  return src("app/images/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            //папка stack для сохранения файла sprite.stack.html
            sprite: "../sprite.svg", //вывод спрайта в папку со всеми изображениями
            example: true,
          },
        },
      })
    )
    .pipe(dest("app/images"));
}

// ф-ция конвертации шрифтов
function fonts() {
  // находим шрифты для конвертации
  return src("app/fonts/src/*.*")
    .pipe(
      fonter({
        formats: ["woff", "ttf"], //конвертация в форматы woff, ttf
      })
    )
    .pipe(src("app/fonts/*.ttf"))
    .pipe(ttf2woff2()) //конвертация в форматы woff2, ttf2
    .pipe(dest("app/fonts")); //вывод в папку fonts
}

// ф-ция include html файлов (работаем с index.html из папки pages)
function pages() {
  // находим все наши файлы html
  return (
    src("app/pages/*.html")
      // находим папку с нашими компонентами html
      .pipe(
        include({
          includePaths: "app/components",
        })
      )
      // выводим наш файл html в папку app
      .pipe(dest("app"))
      // обновление страницы, если есть изменения
      .pipe(browserSync.stream())
  );
}

// ф-ция автоматического обновления вэб-страницы и слежения за изменениями в файлах и папках проекта
function watching() {
  // слежение за браузером
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
  // слежение за файлами scss, если есть изменения - запускается styles
  watch(["app/scss/**/*.scss"], styles);
  // слежение за изображениями, если есть - запускается images
  watch(["app/images/src"], images);
  // слежение за файлом js, если есть изменения - запускается scripts
  watch(["app/js/main.js"], scripts);
  // слежение за папками app/components и app/pages - запускается pages
  watch(["app/components/*", "app/pages/*"], pages);
  // слежение за изменениями во всех файлах html - запускается browserSync
  watch(["app/*.html"]).on("change", browserSync.reload);
  // watch(['app/**/*.html']).on('change', browserSync.reload);
}

// ф-ция удаления папки dist
function cleanDist() {
  // находим папку dist
  return src("dist").pipe(clean());
}

//ф-ция сборки проекта с переносом всех папок и файлов в dist
function building() {
  // находим все необходимые файлы для переноса, кроме исключений
  return src(
    [
      "app/css/style.min.css",
      "app/images/*.*",
      "!app/images/*.svg",
      // 'app/images/sprite.svg',
      "app/fonts/*.*",
      "app/js/main.min.js",
      "app/*.html",
      "!app/images/stack/sprite.stack.html",
    ],
    { base: "app" }
  ) // сохраняем структуру проекта
    .pipe(dest("dist")); // выгружаем все в папку dist
}

// запуск ф-ции преобразования sass/scss файлов
exports.styles = styles;
// запуск обработки js файлов
exports.scripts = scripts;
// запуск слежения за изменениями в файлах
exports.watching = watching;
// запуск преобразования изображений
exports.images = images;
// запуск обработки svg-sprite
exports.sprite = sprite;
// запуск конвертации шрифтов
exports.fonts = fonts;
// запуск include
exports.pages = pages;
// запуск функции удаления папки dist
exports.cleanDist = cleanDist;
// запуск сборки проекта в папку dist
exports.building = building;

// запуск поочередного процесса: удаление папки dist, затем сборка проекта
exports.build = series(cleanDist, building);
// запуск по умолчанию параллельной работы ф-ций (пишем слово gulp для запуска)
exports.default = parallel(styles, images, scripts, pages, watching);
