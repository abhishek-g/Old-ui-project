/**
 * Created by abhishekgoray on 11/26/14.
 */

define(['angular','./js/services/services.js','./js/directives/global-directives.js'],function(angular){

    var Global = angular.module('SolarPulse.Global',['SolarPulse.Global.Services','SolarPulse.Global.Directives']);

    return Global;

});