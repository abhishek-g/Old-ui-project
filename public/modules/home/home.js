/**
 * Created by abhishekgoray on 11/27/14.
 */

define(['angular', './js/controllers/controllers.js', './js/directives/directives.js', './js/services/services.js',
    '/modules/global/global.js'], function (angular) {

    var Home = angular.module('SolarPulse.Home', ['SolarPulse.Home.Controllers', 'SolarPulse.Home.Directives',
        'SolarPulse.Home.Services', 'SolarPulse.Global']);

    return Home;
});