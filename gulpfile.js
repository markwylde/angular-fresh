/* globals require */

var gulp = require('gulp');
var path = require('path');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var fs = require('fs');
var chalk = require('chalk');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var exec = require('child_process').exec;
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var concat = require('gulp-concat');
var order = require('gulp-order');
var del = require('del');
var Q = require('q');
var htmlhint = require('gulp-htmlhint');
var w3cjs = require('gulp-w3cjs');

var globals = ['angular'];

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('default', function() {
    console.log('\n\n');
    console.log(chalk.cyan('Three tasks are available for this gulp:\n'));
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
    console.log(chalk.yellow('Started at '), '[ ' + chalk.gray(new Date()) + ' ]');

    Q.fcall(CleanUpPrevious)
     .then(CompileJavaScript)
     .then(TestValidJavascript)
     .then(TestValidHTML)
     .then(CompileModules)
     .then(CopyViews)
     .then(BuildLess)
     .then(CopyAssets)
     .then(ConcatJavascript)
     .then(CleanUpTemp)
     .then(function() {
         console.log(chalk.yellow('Finished at '), '[ ' + chalk.gray(new Date()) + ' ]');
     });

});

gulp.task('build-no-validation', function() {
    console.log('\n\n');
    // ---------------------------------------

    console.log(chalk.blue('Building your ngFresh application: '));
    console.log(chalk.yellow('Started at '), '[ ' + chalk.gray(new Date()) + ' ]');

    Q.fcall(CleanUpPrevious)
     .then(CompileJavaScript)
     //.then(TestValidJavascript)
     //.then(TestValidHTML)
     .then(CompileModules)
     .then(CopyViews)
     .then(BuildLess)
     .then(CopyAssets)
     .then(ConcatJavascript)
     .then(CleanUpTemp)
     .then(function() {
         console.log(chalk.yellow('Finished at '), '[ ' + chalk.gray(new Date()) + ' ]');
     });

});

gulp.task('compile', function() {

    console.log('\n\n');

    process.stdout.write(chalk.blue('(2/2)') + ' Coping libraries to vendor: ');

    gulp.src(['./bower_components/**/*'])
        .pipe(copy('./dist/vendor', { prefix: 1 }));

    console.log(chalk.green('Complete'));

    console.log('\n');

});


// STEP 1: ---------------------------------------
var CleanUpPrevious = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(1/10)') + ' Deleting previous compiled files: ');
    del([
        'dist/assets/**/*',
        'dist/views/**/*'
    ], function() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }, function() {
        deferred.reject(true);
        console.log(chalk.red('Failed'));
    });

    return deferred.promise;
}
// -----------------------------------------------

// STEP 2: ---------------------------------------
var CompileJavaScript = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(2/10)') + ' Compile and build generic javascript files: ');

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
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }, function() {
        deferred.reject(true);
        console.log(chalk.red('Failed'));
    });

    return deferred.promise;
}
// -----------------------------------------------

// STEP 3: ---------------------------------------
var TestValidJavascript = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(3/10)') + ' Testing all JavaScript code is valid: ');

    gulp.src('./src/**/*.js')
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))

    .on('finish', function() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }, function() {
        deferred.reject(true);
        console.log(chalk.red('Failed'));
    });

    return deferred.promise;
}
// -----------------------------------------------

// STEP 5: ---------------------------------------
var TestValidHTML = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(4/10)') + ' Testing all HTML code is valid: ');

    //gulp.src('./src/**/*.html')
    //    .pipe(w3cjs())
    //    .pipe(w3cjs.reporter('fail'))

    //.on('finish', function() {
        console.log(chalk.yellow('Skipped'));
        deferred.resolve(true);
    //}, function() {
    //    deferred.reject(true);
    //    console.log(chalk.red('Failed'));
    //});

    return deferred.promise;
}
// -----------------------------------------------

// STEP 5: ---------------------------------------
var CompileModules = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(5/10)') + ' Compiling individual application modules: ');

    var folders = getFolders('./src/modules/');
    var foldersPending = 0;
    var tasks = folders.map(function(folder) {
        foldersPending = foldersPending + 1;
        gulp.src('./src/modules/' + folder + '/**/*.{js,ts}', {base:'src'})
            .pipe(sourcemaps.init({debug: true}))
            .pipe(gulpif(/(.+?)\.ts/, ts({
                declarationFiles: true,
                noExternalResolve: true,
                sourceRoot: 'modules/' + folder + '/',
                base: '../../'
            })))
            .pipe(concat(folder + '.js'))
            .pipe(uglify())
            .pipe(rename(function(path) {
                path.extname = '.min.js';
            }))
            .pipe(sourcemaps.write('../assets', {sourceRoot: '/src'}))
            .pipe(gulp.dest('./dist/assets/'))

        .on('finish', function() {
            foldersPending = foldersPending - 1;
            if (foldersPending == 0) {
                finished();
            }
        });
    });

    function finished() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    };

    return deferred.promise;
}
// -----------------------------------------------

// STEP 6: ---------------------------------------
var CopyViews = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(6/10)') + ' Copying the individual module views: ');

    var folders = getFolders('./src/modules/');
    var foldersPending = 0;
    var tasks = folders.map(function(folder) {
        foldersPending = foldersPending + 1;

        gulp.src('./src/modules/' + folder + '/views/**/*')
            .pipe(copy('./dist/views/' + folder + '/', { prefix: 4 }))

        .on('end', function() {
            foldersPending = foldersPending - 1;
            if (foldersPending == 0) {
                finished();
            }
        });
    });

    function finished() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    };

    return deferred.promise;
}
// -----------------------------------------------

// STEP 7: ---------------------------------------
var BuildLess = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(7/10)') + ' Building the LESS style files: ');

    gulp.src('./src/assets/less/app.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(rename(function(path) {
            path.basename = 'app_core';
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('./dist/assets'))

    .on('finish', function() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }, function() {
        deferred.reject(true);
        console.log(chalk.red('Failed'));
    });

    return deferred.promise;
}
// -----------------------------------------------

// STEP 8: ---------------------------------------
var CopyAssets = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(8/10)') + ' Copy the image assets to dist: ');

    gulp.src(['./src/assets/img/*.*', './src/assets/img/**/*'])
        .pipe(copy('./dist/assets/img', { prefix: 3 }))

    .on('end', function() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }, function() {
        deferred.reject(true);
        console.log(chalk.red('Failed'));
    });

    return deferred.promise;
}
// -----------------------------------------------

// STEP 9: ---------------------------------------
var ConcatJavascript = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(9/10)') + ' Merging the modules and javascript code: ');

    gulp.src('./dist/assets/*.js')
        .pipe(order([
          'view.min.js',
          'app.min.js',
          '*.j'
        ]))
        .pipe(sourcemaps.init({debug: true, loadMaps: true}))
        .pipe(concat('app_core.min.js'))
        .pipe(sourcemaps.write('../assets/'))
        .pipe(gulp.dest('./dist/assets/'))

    .on('finish', function() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }, function() {
        deferred.reject(true);
        console.log(chalk.red('Failed'));
    });

    return deferred.promise;
}
// -----------------------------------------------

// STEP 10: ---------------------------------------
var CleanUpTemp = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(10/10)') + ' Removing the temporary compilation files: ');

    del([
        'dist/assets/*.js',
        'dist/assets/*.js.map',
        '!dist/assets/app_core.min.js',
        '!dist/assets/app_core.min.js.map'
    ], function() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }, function() {
        deferred.reject(true);
        console.log(chalk.red('Failed'));
    });

    return deferred.promise;
}
// -----------------------------------------------