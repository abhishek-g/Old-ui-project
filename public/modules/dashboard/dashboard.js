/**
 * Created by abhishekgoray on 11/26/14.
 */


define(['angular','./js/controllers/dashboard-controllers.js','./js/directives/dashboard-directives.js','./js/services/dashboard-services.js',
    './js/directives/single-site-directives.js','./js/controllers/single-site-controllers.js',
    './js/directives/all-zones-directives.js','./js/controllers/all-zones-controllers.js',
    './js/directives/single-zone-directives.js','./js/controllers/single-zone-controllers.js',
    './js/directives/sensor-box-directives.js','./js/controllers/sensor-box-controller.js',
    './js/controllers/invoverview-controllers.js','./js/directives/invoverview-directives.js',
    './js/controllers/gmeter-controllers.js','./js/directives/gmeter-directives.js',
    './js/services/device-services.js'],function(angular){
    var Dashboard = angular.module('SolarPulse.Dashboard',['SolarPulse.Dashboard.Controllers',
        'SolarPulse.Dashboard.Directives','SolarPulse.Dashboard.Services'
        ,'SolarPulse.SingleSite.Directives','SolarPulse.SingleSite.Controllers'
        ,'SolarPulse.AllZones.Directives','SolarPulse.AllZones.Controllers'
        ,'SolarPulse.SingleZone.Directives','SolarPulse.SingleZone.Controllers'
        ,'SolarPulse.InvOverview.Controllers','SolarPulse.InvOverview.Services'
        ,'SolarPulse.InvOverview.Directives','SolarPulse.SensorBox.Directives'
        ,'SolarPulse.Gmeter.Controller','SolarPulse.Gmeter.Directives'
        ,'SolarPulse.SensorBox.Controllers']);


    return Dashboard;

});