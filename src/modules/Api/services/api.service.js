angular.module('app.api')

.factory('api', ['Restangular',
    function(Restangular) {

        return Restangular;

    }
]);