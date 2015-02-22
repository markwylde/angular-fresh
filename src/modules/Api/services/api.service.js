/*global JsonAPI*/

"use strict";

angular.module('app.api')

    .factory('api', [
        function () {
            var jsonAPI = new JsonAPI();
            return jsonAPI;
        }]);