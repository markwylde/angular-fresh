angular.module('app.core', [
    'ngRoute'
])

.config(['$routeProvider',
    function($routeProvider, $provide, $httpProvider, RestangularProvider) {

        var ___ = 'views/Core/';

        $routeProvider
        .when('/', {
            title: 'Home',
            controller: 'HomeCtrl',
            templateUrl: ___+ 'home/home.html'
        })
        .when('/news', {
            title: 'News',
            controller: 'HomeCtrl',
            templateUrl: ___+ 'home/news.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    }

]);
