/**
 * Created by abhishekgoray on 4/6/15.
 */

define(function(require){

    var angular = require('angular');
    require('./js/controllers/users-controller.js');
    require('./js/directives/users-directives.js');
    require('./js/services/users-service.js');

    return angular.module("SolarPulse.Users",['SolarPulse.Users.Controllers','SolarPulse.Users.Directives','SolarPulse.Users.Services']);
});