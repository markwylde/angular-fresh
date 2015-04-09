angular.module('app.core')

    .directive('footerBar', [
        function() {
            return {
                scope: {
                    selected: '@'
                },
                templateUrl: 'modules/Core/views/partials/footerbar.html'
            };
        }
    ]);
