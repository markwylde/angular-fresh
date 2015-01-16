angular.module('app.core', [
    'ngRoute'
])

.config(['$routeProvider',
    function($routeProvider, $provide, $httpProvider, RestangularProvider) {

        var ___ = 'views/Core/';

        $routeProvider
        .when('/', {
            title: 'Dashboard',
            controller: 'HomeCtrl',
            templateUrl: ___+ 'home/home.html'
        })
        .when('/test', {
            title: 'Test',
            controller: 'HomeCtrl',
            templateUrl: ___+ 'home/test.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    }

]);
