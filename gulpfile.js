let gulp = require("gulp");
let sass = require("gulp-sass");
let concat = require("gulp-concat");
let minCss = require("gulp-clean-css")
let babel = require("gulp-babel");
let htmlmin = require("gulp-htmlmin");
let autoprefixer = require("gulp-autoprefixer");
let server = require("gulp-webserver")
let uglify = require("gulp-uglify")
let path = require("path")
let url = require("url");
let fs = require("fs")

gulp.task("devscss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(concat('all.css'))
        .pipe(minCss())
        .pipe(gulp.dest("./src/css"))

})


gulp.task('server', function() {
        return gulp.src('src')
            .pipe(server({
                port: 3030,
                open: true,
                livereload: true,
                middleware: function(req, res, next) {
                    var pathname = url.parse(req.url).pathname;
                    if (pathname === '/favicon.ico') {
                        res.end()
                        return
                    }
                    if (pathname === '/api/list') {
                        res.end(JSON.stringify({ code: 1, data: list }))
                    } else {
                        pathname = pathname === '/' ? 'index.html' : pathname;
                        res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                    }
                }
            }))
    })
    //压缩js
gulp.task("bUglify", function() {
    return gulp.src(["./src/js/*.js"])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./bulid/js"))
})


//压缩html
gulp.task("bHtml", function() {
    return gulp.src("./src/**/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./bulid'))

})

//监听js css
gulp.task("watch", function() {
    gulp.watch("./src/scss/*.scss", gulp.series("devscss"))
    gulp.watch("./src/js/*.js", gulp.series("bUglify"))
})

gulp.task("defalut", gulp.series("bUglify", "devscss", "server", "watch"))