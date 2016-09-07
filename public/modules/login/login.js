/**
 * Created by abhishekgoray on 11/26/14.
 */

define(['angular', './js/controllers/controllers.js', './js/directives/directives.js', './js/services/services.js', './../global/global.js'],
    function (angular) {

        var Login = angular.module("SolarPulse.Login", ['SolarPulse.Login.Controllers', 'SolarPulse.Login.Directives',
            'SolarPulse.Login.Services', 'SolarPulse.Global']);

        return Login;
    });