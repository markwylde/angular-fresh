angular.module('app.core')

    .controller('HomeCtrl', ['$scope', '$rootScope', 'api',
        function($scope, $rootScope, api) {
            api.example('Joe Smith');
            $rootScope.title = 'Home page';
            $scope.message = 'Hello there';
        }]);
