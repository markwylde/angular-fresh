// Karma configuration
// Generated on Fri May 23 2014 18:04:32 GMT+0100 (BST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/select2/select2.js',
            'bower_components/moment/moment.js',
            'bower_components/jquery-ui/ui/jquery-ui.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
            'bower_components/angular-ui-select2/src/select2.js',
            'bower_components/angular-datepicker/dist/index.js',
            'bower_components/angular-promise-tracker/promise-tracker.js',
            'bower_components/lodash/dist/lodash.compat.js',
            'bower_components/restangular/dist/restangular.js',
            'bower_components/angular-animate/angular-animate.js',
            'src/app.js',
            'src/controllers/*.js',
            'src/directives/*.js',
            'src/services/*.js',
            'test/unit/**/*.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {

        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
