angular.module('app.core')

.directive('footerBar', ['api',
    function(api) {
        return {
            scope: {
                selected: '@'
            },
            link: function(scope, attr, element) {

            },
            templateUrl: 'views/Core/partials/footerbar.html'
        };
    }
]);
