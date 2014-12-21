angular.module('app.core')

.filter('momentFromNow', function() {
    return function(dateString) {
        return moment(new moment.unix(dateString)).fromNow();
    };
})

.filter('momentAdvancedFormat', function() {
    return function(dateString, toFormat) {
        return moment(new moment.unix(dateString)).format(toFormat);
    };
})

.filter('momentISOFormat', function () {
    return function(dateString, format) {
        return moment(dateString).format(format);
    };
})

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
})

.filter('momentDiffPercentage', function() {
    return function(dateString, secondDate) {
        var daysOne = moment(new moment.unix(dateString)).diff(secondDate, 'days');
        var daysTwo = moment(new moment.unix(dateString)).diff(new Date(), 'days');
        return parseInt(100 - (daysTwo / daysOne) * 100);
    };
})

.filter('fromTimestamp', function() {
    return function(input) {
        input = new Date(input * 1000);
        return input;
    };
});
