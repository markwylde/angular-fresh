angular.module('app.core')

.directive('headerBar', ['api',
    function(api) {
        return {
            scope: {
                selected: '@'
            },
            link: function(scope, attr, element) {

            },
            templateUrl: 'views/Core/partials/headerbar.html'
        };
    }
]);
