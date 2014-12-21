'use strict';

// CONFIGURATION
$.ajax({
    url: 'configuration.json',
    type: 'get',
    dataType: 'json'
}).then(function(data) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
}, function() {
    document.write("Could not read configuration file");
});

// BOOT MODULE
angular.module('app', [
    /* [BEGIN INJECT: MODULES] */
    'app.api',
    'app.core',
    /* [END INJECT: MODULES] */
    'ngAnimate',
    'ngRoute',
    'ngResource'
])

.config([
    function() {

    }
]);