"use strict";

angular.module('app.core')

    .directive('sideBar', [
        function () {
            return {
                scope: {
                    selected: '=',
                    template: '@'
                },
                link: function (scope) {
                    scope.getContentUrl = function () {
                        return (scope.template || 'views/Core/partials/sidebar.html');
                    };
                },
                template: '<div ng-include="getContentUrl()"></div>'
            };
        }]);
