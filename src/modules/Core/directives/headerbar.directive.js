angular.module('app.core')

    .directive('headerBar', [
        function() {
            return {
                scope: {
                    selected: '@'
                },
                templateUrl: 'modules/Core/views/partials/headerbar.html'
            };
        }
    ]);
