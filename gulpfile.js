var gulp = require('gulp');
var path = require('path');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var copy = require('gulp-copy');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var fs = require('fs');
var chalk = require('chalk');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var exec = require('child_process').exec;
var findRemoveSync = require('find-remove');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('default', function() {
    console.log('\n\n');
    console.log(chalk.cyan("Two tasks are available for this gulp:\n"));
    console.log('watch: will watch for any changes then rebuild');
    console.log('build: will do a build and minify of all less and js files');
    console.log('compile: will do a complete build and copy all libraries in a production ready state');
    console.log('\n');
});

gulp.task('watch', function() {
    console.log('\n\nWatching the src file for changes...');
    var watcher = gulp.watch([
            './src/**/*',
            '!./**/*.tmp*'], ['build']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    console.log('\n');
});

gulp.task('build', function() {
    console.log('\n\n');
    // ---------------------------------------

    console.log(chalk.blue('Building your ngFresh application: '));
    process.stdout.write(chalk.blue('(1/7)') + ' Compiling TypeScript files: ');

        gulp.src('./src/**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(ts({
                declarationFiles: true,
                noExternalResolve: true
            }))
            .on('error', function(error) {
                //console.log("\007");
                exec('afplay /System/Library/Sounds/Hero.aiff');
            })
            .pipe(rename(function(path) {
                path.extname = ".tmp.js"
            }))
            .pipe(sourcemaps.write('../src/'))
            .pipe(gulp.dest('./src/'))
            .on('finish', function() {
                console.log(chalk.green('Complete'));
                process.stdout.write(chalk.blue('(2/7)') + ' Compile and build generic javascript files: ');

                gulp.src(['./src/app.js'])
                    .pipe(sourcemaps.init())
                    .pipe(concat('app.js'))
                    .pipe(uglify())
                    .pipe(rename(function(path) {
                        path.extname = '.min.js';
                    }))
                    .pipe(sourcemaps.write('../assets', {sourceRoot: '/src/'}))
                    .pipe(gulp.dest('./dist/assets'))

            .on('finish', function() {

                gulp.src(['./src/assets/js/view.js'])
                    .pipe(sourcemaps.init())
                    .pipe(concat('view.js'))
                    .pipe(uglify())
                    .pipe(rename(function(path) {
                        path.extname = '.min.js';
                    }))
                    .pipe(sourcemaps.write('../assets', {sourceRoot: '/src/assets/js/'}))
                    .pipe(gulp.dest('./dist/assets'))

            .on('finish', function() {
                console.log(chalk.green('Complete'));
                process.stdout.write(chalk.blue('(3/7)') + ' Compile and build the individual modules javascript: ');

                var folders = getFolders('./src/modules/');
                var foldersPending = 0;
                var tasks = folders.map(function(folder) {
                    foldersPending = foldersPending + 1;
                    gulp.src('./src/modules/' + folder + '/**/*.js')
                        .pipe(sourcemaps.init())
                        .pipe(concat(folder + '.js'))
                        //.pipe(uglify())
                        .pipe(rename(function(path) {
                            path.extname = '.min.js';
                        }))
                        .pipe(sourcemaps.write('../assets', {sourceRoot: '/src/modules/' + folder}))
                        .pipe(gulp.dest('./dist/assets/'))

            .on('finish', function() {
                foldersPending = foldersPending - 1;

                if (foldersPending == 0) {

                    console.log(chalk.green('Complete'));
                    process.stdout.write(chalk.blue('(4/7)') + ' Copy over the module views: ');

                    gulp.src('./src/modules/' + folder + '/views/**/*')
                        .pipe(copy('./dist/views/' + folder + '/', { prefix: 4 }))
            .on('end', function() {

                console.log(chalk.green('Complete'));
                process.stdout.write(chalk.blue('(5/7)') + ' Build the css files from less: ');

                gulp.src('./src/assets/less/app.less')
                    .pipe(sourcemaps.init())
                    .pipe(less())
                    .pipe(cssmin())
                    .pipe(rename(function(path) {
                        path.extname = '.min.css';
                    }))
                    .pipe(sourcemaps.write('../assets'))
                    .pipe(gulp.dest('./dist/assets'))

            .on('finish', function() {

                console.log(chalk.green('Complete'));
                process.stdout.write(chalk.blue('(6/7)') + ' Copy the image assets to dist: ');

                gulp.src(['./src/assets/img/*.*', './src/assets/img/**/*'])
                    .pipe(copy('./dist/assets/img', { prefix: 3 }))

            .on('end', function() {

                console.log(chalk.green('Complete'));
                process.stdout.write(chalk.blue('(7/7)') + ' Cleaning temporary files: ');

                  gulp.src('./src/**/*.tmp.js*', { read: false }) // much faster
                    .pipe(rimraf())

            .on('finish', function() {;
                console.log(chalk.green('Complete'));
            });
            });
            });
            });
            }
            });
            });
            });
            });
            });

    console.log('\n');

});

gulp.task('compile', function() {

    console.log('\n\n');

    // ---------------------------------------

    process.stdout.write(chalk.blue('(2/2)') + ' Coping libraries to vendor: ');

        gulp.src(['./bower_components/**/*'])
            .pipe(copy('./dist/vendor', { prefix: 1 }));

        console.log(chalk.green('Complete'));

    // ---------------------------------------

    console.log('\n');

});
