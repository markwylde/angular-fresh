// CONFIGURATION
$.ajax({
    url: 'configuration.json',
    type: 'get',
    dataType: 'json'
}).then(function(data) {
    window.globalConfig = data;
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
}, function() {
    $('body').html('Could not read configuration file');
});

// BOOT MODULE
angular.module('app', [
    'app.api',
    'app.core',

    'ngAnimate',
    'ngRoute',
    'ngResource',
    'angular-sourcemaps'
])

.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
])

.run(['$rootScope', function($rootScope) {
    $rootScope.globalConfig = window.globalConfig;
}]);
