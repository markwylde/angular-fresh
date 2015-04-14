/* globals require, process,  __dirname */

var gulp = require('gulp');
var path = require('path');
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
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var concat = require('gulp-concat');
var order = require('gulp-order');
var del = require('del');
var Q = require('q');
//var htmlhint = require('gulp-htmlhint');
//var w3cjs = require('gulp-w3cjs');

//var globals = ['angular'];

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('default', function() {
    console.log('\n\n');
    console.log(chalk.cyan('Two tasks are available for this gulp:\n'));
    console.log('dev: will start a local webserver from the src folder');
    console.log('build: will compile the dist folder ready for production');
    console.log('\n');
});

gulp.task('dev', function() {

    var liveReloadEnabled;

    // Cache the distributions index file as a base
    var indexFileData;
    var appJsData;
    var fs = require('fs');
    fs.readFile('./dist/index.html', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        indexFileData = data;
    });
    fs.readFile('./src/app.js', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }

        data = data + '\n' + 'angular.module(\'app\') ';
        data = data + '\n' + '.run([\'$templateCache\', \'$route\', ';
        data = data + '\n' + 'function($templateCache, $route) { ';
        data = data + '\n' + '    var socket = window.io(); ';
        data = data + '\n' + '    socket.on(\'cache-change\', function(msg) { ';
        data = data + '\n' + '        console.info(\'cache-change: \', msg); ';
        data = data + '\n' + '        $templateCache.remove(msg.file); ';
        data = data + '\n' + '        $route.reload(); ';
        data = data + '\n' + '    }); ';
        data = data + '\n' + '}]); ';

        appJsData = data;
    });

    // START EXPRESS SERVER
    var express = require('express');
    express.static.mime.define({'text/javascript': ['ts']});

    var app = express();

    app.get('/app.js', function(req, res) {
        res.send(appJsData);
    });

    app.use('/vendor', express.static('./bower_components'));
    app.use('/bower_components', express.static('./bower_components'));
    app.use(express.static('./src'));

    app.get('/', function(req, res) {
        generatePage(req, res);
    });

    app.use(function(req, res) {
        generatePage(req, res);
    });

    function generatePage(req, res) {
        // STEP 1) Find what JS and TS files are in src
        var files = {
            javascript: [],
            typescript: []
        };

        var finder = require('findit')('./src');

        finder.on('file', function(file) {
            if (file.substr(-3) === '.js') {
                files.javascript.push(file);
            } else if (file.substr(-3) === '.ts') {
                files.typescript.push(file);
            }
        });

        finder.on('end', function(file) {

            // STEP 2) Now we have the script file list organise it
            // Note: The load order is somewhat important. You must
            // load the app.js file first, and then each module.js,
            // but after that, the load order should not matter

            var xprtScripts = '';

            // 2.1) Lets find what modules we have:
            function getDirectories(srcpath) {
                var path = require('path');
                return fs.readdirSync(srcpath).filter(function(file) {
                    return fs.statSync(path.join(srcpath, file)).isDirectory();
                });
            }
            var modules = getDirectories('./src/modules');

            // 2.2) Now lets push those module.js files to the top
            var index;
            for (var module in modules) {
                index = files.javascript.indexOf('src/modules/' + modules[module] + '/module.js');

                if (index > -1) {
                    files.javascript.splice(index, 1);
                }

                xprtScripts = xprtScripts + '\n<script type="text/javascript" src="modules/' + modules[module] + '/module.js"></script>';
            }

            // 2.3) app.js should be the first loaded, so lets bump that to the top
            index = files.javascript.indexOf('src/app.js');

            if (index > -1) {
                files.javascript.splice(index, 1);
            }

            xprtScripts = '\n<script type="text/javascript" src="app.js"></script>' + xprtScripts;

            if (liveReloadEnabled) {
                xprtScripts = xprtScripts + '\n<script src="/socket.io/socket.io.js"></script>';
            }

            // STEP 3) Lets generate the list of scripts to send to the browser
            for (file in files.typescript) {
                xprtScripts = xprtScripts + '\n<script type="text/typescript" src="' + files.typescript[file].substr(4) + '"></script>';
            }
            for (file in files.javascript) {
                xprtScripts = xprtScripts + '\n<script type="text/javascript" src="' + files.javascript[file].substr(4) + '"></script>';
            }
            xprtScripts = '\n<script src="vendor/less/dist/less.min.js"></script>' + xprtScripts;
            xprtScripts = xprtScripts + '\n<script src="vendor/typescript-compile/js/typescript.js"></script>';
            xprtScripts = xprtScripts + '\n<script src="vendor/typescript-compile/js/typescript.compile.js"></script>';

            // STEP 4) Replace the styles and scripts from the production index
            // file with the newly generated ones
            var tmpIndexFileData = indexFileData;
            tmpIndexFileData = tmpIndexFileData.replace('<script src="assets/app_core.min.js"></script>', xprtScripts);
            tmpIndexFileData = tmpIndexFileData.replace('<link rel="stylesheet" href="assets/app_core.min.css" />',
                '<link rel="stylesheet/less" type="text/css" href="assets/less/app.less" />');

            // Finally...
            res.send(tmpIndexFileData);
        });

    }

    var server = app.listen(3000, function() {

        var host = server.address().address;
        var port = server.address().port;

        console.log('Web server src listening at http://%s:%s', host, port);

    });

    var io = require('socket.io')(server);
    var chokidar = require('chokidar');
    chokidar.watch(__dirname + '/src', {ignored: /[\/\\]\./}).on('all', function(event, path) {
        if (event === 'add' || event === 'addDir') {
            return;
        }
        console.log(event, path);
        path = path.replace(__dirname + '/src/', '');
        io.emit('cache-change', { type: event, file: path });
    });

    var http = require('http').Server(app);
    http.listen(3001, function() {
        liveReloadEnabled = true;
        console.log('Live reload listening on *:3001');
    });

});

gulp.task('build', function() {
    console.log('\n\n');
    // ---------------------------------------

    console.log(chalk.blue('Building your Angular Fresh application: '));
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
     .then(CopyVendor)
     .then(CleanUpTemp)
     .then(function() {
         console.log(chalk.yellow('Finished at '), '[ ' + chalk.gray(new Date()) + ' ]');
     });

});

gulp.task('build-no-validation', function() {
    console.log('\n\n');
    // ---------------------------------------

    console.log(chalk.blue('Building your Angular Fresh application: '));
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

// STEP 1: ---------------------------------------
var CleanUpPrevious = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(1/11)') + ' Deleting previous compiled files: ');
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
};
// -----------------------------------------------

// STEP 2: ---------------------------------------
var CompileJavaScript = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(2/11)') + ' Compile and build generic javascript files: ');

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
};
// -----------------------------------------------

// STEP 3: ---------------------------------------
var TestValidJavascript = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(3/11)') + ' Testing all JavaScript code is valid: ');

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
};
// -----------------------------------------------

// STEP 5: ---------------------------------------
var TestValidHTML = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(4/11)') + ' Testing all HTML code is valid: ');

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
};
// -----------------------------------------------

// STEP 5: ---------------------------------------
var CompileModules = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(5/11)') + ' Compiling individual application modules: ');

    var folders = getFolders('./src/modules/');
    var foldersPending = 0;
    folders.map(function(folder) {
        foldersPending = foldersPending + 1;
        gulp.src('./src/modules/' + folder + '/**/*.{js,ts}', {base:'src'})
            .pipe(sourcemaps.init())
            .pipe(gulpif(/(.+?)\.ts/, ts({
                declarationFiles: true,
                noExternalResolve: true,
                emitDecoratorMetadata: true,
                target: 'es5',
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
            if (foldersPending === 0) {
                finished();
            }
        });
    });

    function finished() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }

    return deferred.promise;
};
// -----------------------------------------------

// STEP 6: ---------------------------------------
var CopyViews = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(6/11)') + ' Copying the individual module views: ');

    var folders = getFolders('./src/modules/');
    var foldersPending = 0;
    folders.map(function(folder) {
        foldersPending = foldersPending + 1;

        gulp.src('./src/modules/' + folder + '/**/*.html')
            .pipe(copy('./dist/modules/' + folder + '/', { prefix: 3 }))

        .on('end', function() {
            foldersPending = foldersPending - 1;
            if (foldersPending === 0) {
                finished();
            }
        });
    });

    function finished() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }

    return deferred.promise;
};
// -----------------------------------------------

// STEP 7: ---------------------------------------
var BuildLess = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(7/11)') + ' Building the LESS style files: ');

    gulp.src('./src/assets/less/app.less')
        .pipe(less({
            paths: [path.join(__dirname)]
        }))
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
};
// -----------------------------------------------

// STEP 8: ---------------------------------------
var CopyAssets = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(8/11)') + ' Copy the image assets to dist: ');

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
};
// -----------------------------------------------

// STEP 9: ---------------------------------------
var ConcatJavascript = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(9/11)') + ' Merging the modules and javascript code: ');

    gulp.src('./dist/assets/*.js')
        .pipe(order([
          'view.min.js',
          'app.min.js',
          '*.j'
        ]))
        .pipe(sourcemaps.init({loadMaps: true}))
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
};
// -----------------------------------------------

// STEP 10: ---------------------------------------
var CopyVendor = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(10/11)') + ' Coping libraries to vendor: ');

    gulp.src(['./bower_components/**/*'])
        .pipe(copy('./dist/vendor', { prefix: 1 }))

    .on('end', function() {
        deferred.resolve(true);
        console.log(chalk.green('Complete'));
    }, function() {
        deferred.reject(true);
        console.log(chalk.red('Failed'));
    });

    return deferred.promise;
};
// -----------------------------------------------

// STEP 11: ---------------------------------------
var CleanUpTemp = function() {
    var deferred = Q.defer();

    process.stdout.write(chalk.blue('(11/11)') + ' Removing the temporary compilation files: ');

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
};
// -----------------------------------------------
