var gulp = require('gulp'),
    $    = require('gulp-load-plugins')(),
    meta = require('./package.json');

var webserver = require('gulp-webserver');

var argv = require('minimist')(process.argv.slice(2));

var jsDir     = 'src/js/',
    sassDir   = 'src/sass/',
    distDir   = 'dist',
    banner    = [
        '/*!',
        ' * =============================================================',
        ' * <%= name %> v<%= version %> - <%= description %>',
        ' * <%= homepage %>',
        ' *',
        ' * (c) 2016 - <%= author %>',
        ' * =============================================================',
        ' */\n\n'
    ].join('\n'),
    umdDeps = {
        dependencies: function() {
            return [
                {
                    name: '$',
                    amd: 'angular',
                    cjs: 'angular',
                    global: 'angular',
                    param: '$'
                },
                {
                    name: '$',
                    amd: 'd3',
                    cjs: 'd3',
                    global: 'd3',
                    param: '$'
                }
            ];
        }
    };

var onError = function (err) {
    $.util.beep();
    console.log(err.toString());
    this.emit('end');
};

gulp.task('sass', function() {
    return gulp.src(sassDir + '*.scss')
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.sass())
        .pipe($.autoprefixer())

        .pipe($.header(banner, meta))
        .pipe(gulp.dest(distDir + "/css"))

        .pipe($.if(!argv.dev, $.minifyCss()))
        .pipe($.if(!argv.dev, $.rename(meta.name + '.min.css')))
        .pipe($.if(!argv.dev, gulp.dest(distDir + "/css")));
});

gulp.task('scripts', function() {
    return gulp.src([jsDir + '*.js'])
        .pipe($.plumber({ errorHandler: onError }))
        //.pipe(gulp.dest(distDir + "/js"))
        //.pipe($.umd(umdDeps))

        .pipe($.header(banner, meta))
        .pipe($.rename(meta.name + '.js'))
        .pipe($.concat(meta.name + '.angular.js'))
        .pipe(gulp.dest(distDir + "/js"))

        .pipe($.if(!argv.dev, $.uglify()))
        .pipe($.if(!argv.dev, $.header(banner, meta)))
        .pipe($.if(!argv.dev, $.rename(meta.name + '.angular.min.js')))
        .pipe($.if(!argv.dev, gulp.dest(distDir + "/js")));
});


gulp.task('default', ['sass', 'scripts'], function() {
    gulp.watch(jsDir + '**/*.js', ['scripts']);
    gulp.watch(sassDir + '**/*.scss', ['sass']);
});

gulp.task('build', ['sass', 'scripts']);

//Web Server
gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      port:'9090',
      livereload: true,
      open: true,
      fallback: './index.html',
      directoryListing: {
        enable:true,
        path: './'
    }
    }));
});
