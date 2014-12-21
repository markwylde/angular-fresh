var gulp = require('gulp');
var path = require('path');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var copy = require('gulp-copy');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var fs = require('fs');
var chalk = require('chalk');

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('default', function() {
    console.log('\n\n');
    console.log(chalk.cyan("Two tasks are available for this gulp:\n"));
    console.log('dev: will watch for any changes then rebuild');
    console.log('build: will do a build and minify of all less and js files');
    console.log('compile: will do a complete build and copy all libraries in a production ready state');
    console.log('\n');
});

gulp.task('dev', function() {
    console.log('\n\nWatching the src file for changes...');
    var watcher = gulp.watch('./src/**/*', ['build']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    console.log('\n');
});

gulp.task('build', function() {
    console.log('\n\n');
    // ---------------------------------------

    process.stdout.write(chalk.blue('(1/3)') + ' Compile and build main javascript file: ');

        gulp.src(['./src/app.js', './src/assets/js/view.js'])
            //.pipe(uglify())
            .pipe(rename(function(path) {
                path.extname = '.min.js';
            }))
            .pipe(gulp.dest('./dist/assets'));

        console.log(chalk.green('Complete'));

    // ---------------------------------------

    process.stdout.write(chalk.blue('(2/3)') + ' Compile and build main javascript file: ');

        var folders = getFolders('./src/modules/');

        var tasks = folders.map(function(folder) {

            gulp.src('./src/modules/' + folder + '/**/*.js')
                .pipe(concat(folder + '.js'))
                //.pipe(uglify())
                .pipe(rename(function(path) {
                    path.extname = '.min.js';
                }))
                .pipe(gulp.dest('./dist/assets/'));

            gulp.src('./src/modules/' + folder + '/views/**/*')
                .pipe(copy('./dist/views/' + folder + '/', { prefix: 4 }));

        });

        console.log(chalk.green('Complete'));

    // ---------------------------------------

    process.stdout.write(chalk.blue('(3/3)') + ' Compile and build less files: ');

    gulp.src('./src/assets/less/app.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(rename(function(path) {
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('./dist/assets'));

        console.log(chalk.green('Complete'));

    // ---------------------------------------

    console.log('\n');

});

gulp.task('compile', function() {

    console.log('\n\n');

    // ---------------------------------------

    process.stdout.write(chalk.blue('(1/2)') + ' Coping assets and images: ');

        gulp.src(['./src/assets/img/*.*', './src/assets/img/**/*'])
            .pipe(copy('./dist/assets/img', { prefix: 3 }));

        console.log(chalk.green('Complete'));

    // ---------------------------------------

    process.stdout.write(chalk.blue('(2/2)') + ' Coping libraries to vendor: ');

        gulp.src(['./bower_components/**/*'])
            .pipe(copy('./dist/vendor', { prefix: 1 }));

        console.log(chalk.green('Complete'));

    // ---------------------------------------

    console.log('\n');

});
