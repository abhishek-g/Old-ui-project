define(['angular'], function (angular) {
    "use strict";

    var Controllers = angular.module('SolarPulse.Home.Controllers', []);

    Controllers.controller("HomeController", ['$rootScope', '$scope', '$state', 'UserService', '$location', 'SiteHierarchy', 'testObj',
        function ($rootScope, $scope, $state, UserService, $location, SiteHierarchy, testObj) {

            $scope.sitesList = SiteHierarchy.formatForSiteHierarchy(testObj.data.data);
            //console.log('site list', $scope.sitesList);
            $scope.User = UserService.getUser();
            $('.js-username').html($scope.User.user.username);

            var path = $location.path();

            if (path.indexOf('/') >= 0) {
                var state = path.substr(1, path.length);
                if (!$.isEmptyObject(state)) {
                    $state.go(state);
                } else {
                    $state.go('dashboard');
                }

            } else {
                $state.go('dashboard');
            }
    }]);

    Controllers.controller("SocketController", ['$scope', '$state', '$timeout', function ($scope, $state, $timeout) {
        var socket = io(),
            alarms = [];
        $scope.alarms = [];
        socket.on('connect', function () {

            console.log("SOCKET IO CONNECTED....");

            socket.emit('join', 'deviceAlarms');

            socket.on("deviceLiveAlarms", function (message) {

                console.log("MESSAGE", message);
                $scope.alarms.unshift(message);
                $scope.alarmCount = $scope.alarms.length;
                $scope.$apply();

            });
        });

        $scope.goToAlarms = function () {
            $state.go('alarms');
        }



    }]);


    return Controllers;
});