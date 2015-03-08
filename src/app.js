/*global _*/

var exceptions = 0;
// CONFIGURATION
$.ajax({
    url: 'configuration.json',
    type: 'get',
    dataType: 'json'
}).then(function() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
}, function() {
    $('body').html('Could not read configuration file');
});

// BOOT MODULE
angular.module('app', [
    /* [BEGIN INJECT: MODULES] */
    'app.api',
    'app.core',
    /* [END INJECT: MODULES] */
    'ngAnimate',
    'ngRoute',
    'ngResource'
])

.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
])

.factory('$exceptionHandler', ['$log', '$window', '$injector',
    function($log, $window, $injector) {

        var getSourceMappedStackTrace = function(exception) {

            exceptions = exceptions + 1;

            var $q = $injector.get('$q');
            var $http = $injector.get('$http');
            var SMConsumer = window.sourceMap.SourceMapConsumer;
            var cache = {};

            // Retrieve a SourceMap object for a minified script URL
            var getMapForScript = function(url) {
                if (cache[url]) {
                    return cache[url];
                } else {
                    var promise = $http.get(url).then(function(response) {
                        var m = response.data.match(/\/\/# sourceMappingURL=(.+\.map)/);
                        if (m) {
                            var path = url.match(/^(.+)\/[^/]+$/);
                            path = path && path[1];
                            return $http.get(path + '/' + m[1]).then(function(response) {
                                return new SMConsumer(response.data);
                            });
                        } else {
                            return $q.reject();
                        }
                    });
                    cache[url] = promise;
                    return promise;
                }
            };

            if (exception.stack) { // not all browsers support stack traces
                return $q.all(_.map(exception.stack.split(/\n/), function(stackLine) {
                    var match = stackLine.match(/^(.+)(http.+):(\d+):(\d+)/);
                    if (match) {
                        var prefix = match[1];
                        var url = match[2];
                        var line = match[3];
                        var col = match[4];
                        return getMapForScript(url).then(function(map) {
                            var pos = map.originalPositionFor({
                                line: parseInt(line, 10),
                                column: parseInt(col, 10)
                            });
                            var mangledName = prefix.match(/\s*(at)?\s*(.*?)\s*(\(|@)/);
                            mangledName = (mangledName && mangledName[2]) || '';
                            return '    at ' + (pos.name ? pos.name : mangledName) + ' ' +
                                $window.location.origin + pos.source + ':' + pos.line + ':' +
                                pos.column;
                        }, function() {
                            return stackLine;
                        });
                    } else {
                        return $q.when(stackLine);
                    }
                })).then(function(lines) {
                    return lines.join('\n');
                });
            } else {
                return $q.when('');
            }
        };

        return function(exception) {
            if (exception.stack.indexOf('source-map.min.js') > -0) {
                return;
            } else {
                getSourceMappedStackTrace(exception).then($log.error);
            }
        };
    }]);
