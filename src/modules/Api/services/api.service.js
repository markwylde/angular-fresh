angular.module('app.api')

.factory('api', ['Restangular',
    function(Restangular) {
        var jsonAPI = new JsonAPI();
        return jsonAPI;

    }
]);