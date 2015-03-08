angular.module('app.core')

    .controller('HomeCtrl', ['$scope', '$rootScope', 'api',
        function($scope, $rootScope, api) {
            api.example('Mark');
            $rootScope.title = 'Home page';
            $scope.message = 'Hello there';
        }]);
