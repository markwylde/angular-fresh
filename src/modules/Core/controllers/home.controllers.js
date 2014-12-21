angular.module('app.core')

.controller('HomeCtrl', ['$scope', '$rootScope', 'api',
    function($scope, $rootScope, api) {

        $rootScope.title = "Home page";
    }
]);
