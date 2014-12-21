angular.module('app.core')

.directive('sideBar', ['$rootScope', 'auth',
    function($rootScope, auth, data) {
        return {
            scope: {
                selected: '=',
                template: '@'
            },
            link: function(scope, element) {
                scope.getContentUrl = function() {
                    return (scope.template || 'views/Core/partials/sidebar.html');
                };
            },
            template: '<div ng-include="getContentUrl()"></div>'
        };
    }
]);
