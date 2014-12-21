angular.module('app.core', [
    'ngRoute'
])

.config(['$routeProvider',
    function($routeProvider, $provide, $httpProvider, RestangularProvider) {

        var ___ = 'views/Core/';

        $routeProvider
        .when('/dashboard', {
            title: 'Dashboard',
            controller: 'HomeCtrl',
            templateUrl: ___+ 'home/home.html'
        })
        .otherwise({
            redirectTo: '/dashboard'
        });

    }

]);
