/*globals moment*/

angular.module('app.core')

    .filter('momentFormat', function() {
        return function(dateString, format) {
            return moment(new moment.unix(dateString)).format(format);
        };
    })

    .filter('momentDiff', function() {
        return function(dateString, secondDate) {
            var daysOne = moment(new moment.unix(dateString)).diff(secondDate, 'days');
            return daysOne;
        };
    });
