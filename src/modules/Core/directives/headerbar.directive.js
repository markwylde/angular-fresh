"use strict";

angular.module('app.core')

    .directive('headerBar', [
        function () {
            return {
                scope: {
                    selected: '@'
                },
                templateUrl: 'views/Core/partials/headerbar.html'
            };
        }
    ]);
