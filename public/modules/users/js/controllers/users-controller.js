/**
 * Created by abhishekgoray on 4/6/15.
 */

define(function(require){
    var angular = require('angular');

    var Controllers = angular.module("SolarPulse.Users.Controllers",[]);

    Controllers.controller("UsersController",['$scope','Users','$timeout','UsersService',function($scope,Users,$timeout,UsersService){
        $scope.users = [];
        $scope.selectedSites=[];
        $scope.toDelUsers = [];
        $scope.message="";
        $scope.messagetext="";
        $scope.mode = 'create';

        $timeout(function(){

            UsersService.getUsersList().then(function (res) {
                $scope.users = Users.getList(res);
            });
        });

        if($scope.sitesList[0].children.length==1){
            $scope.selectedSites=[{id:$scope.sitesList[0].children[0].id ,name:$scope.sitesList[0].children[0].label}];
        }

        $scope.saveUser = function(){
            $scope.User.siteaccess = $scope.selectedSites;
            UsersService.addUser($scope.User).then(function (res) {
                $scope.message = "S";
                $scope.messagetext = "User added successfully";
                $scope.User = res.data;
                $scope.addUserToTable();
                $scope.User = {};

                $timeout(function(){
                    $scope.message="";
                },1000);

                $scope.clearData();

            },function(err){
                $scope.message="E";
                $scope.messagetext = "Something went wrong !!! Inconvenience is regretted";
            });
        };

        $scope.editUser = function(){
            $scope.User.siteaccess = $scope.selectedSites;
            UsersService.editUser($scope.User).then(function(res){
                $scope.editUserInTable();
                $scope.message = "S";
                $scope.messagetext = "User edited successfully";

                $timeout(function(){
                    $scope.message="";
                },1000);

                $scope.clearData();

            },function(err){
                $scope.message="E";
                $scope.messagetext = "Something went wrong !!! Inconvenience is regretted";
            });
        };

        $scope.deleteUser = function(){
            console.log("toDelUsers in controller" , $scope.toDelUsers);
            UsersService.deleteUser($scope.toDelUsers).then(function (res) {
                $scope.deleteSuccessMessage = true;

                Users.deleteFromList($scope.toDelUsers);
                $scope.deleteUsersFromTable();
                $scope.message = "S";
                $scope.messagetext = "Users deleted successfully";

                $timeout(function(){
                    $scope.message="";
                },1000);

                $scope.clearData();

            } , function(err){
                $scope.message="E";
                $scope.messagetext = "Something went wrong !!! Inconvenience is regretted";
            });
        };

        $scope.clearData = function() {
            $scope.User = {};
        };

    }]);

    return Controllers;
});