angular.module('app.core')

    .directive('footerBar', [
        function() {
            return {
                scope: {
                    selected: '@'
                },
                templateUrl: 'views/Core/partials/footerbar.html'
            };
        }
    ]);
