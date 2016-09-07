/**
 * Created by abhishekgoray on 11/26/14.
 */

define(['angular', './js/services/alarms-services.js', './js/directives/alarms-directives.js',
    './js/controllers/alarms-controllers.js','/modules/global/global.js'], function (angular) {

    var SingleSite = angular.module('SolarPulse.Alarms', ['SolarPulse.Alarms.Services', 'SolarPulse.Alarms.Directives',
        'SolarPulse.Alarms.Controllers','SolarPulse.Global']);
    return SingleSite;
    });