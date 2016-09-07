/**
 * Created by abhishekgoray on 11/26/14.
 */
define(['angular'] , function(angular){
    "use strict";

    var Controllers = angular.module('SolarPulse.Login.Controllers',[]);

    Controllers.controller("LoginController",['$scope','$rootScope','$state','LoginService','$cookies','UserService',
        function($scope,$rootScope,$state,LoginService,$cookies,UserService){
        $scope.authenticateUser = function(User){
            console.log("USER",User);

            LoginService.authenticateUser(User).then(function(res){
                if(res == "Invalid Account") {
                    $scope.$broadcast("error", res);
                }
                $cookies.Session=true;
                UserService.setUser(res);
                $state.go('home');
            },function(err){
                $scope.$broadcast("error" , err);
            });

        }

    }]);

    return Controllers;
});