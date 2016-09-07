/**
 * Created by abhishekgoray on 12/16/14.
 */

define(['angular'], function (angular) {

    var Controllers = angular.module('SolarPulse.Alarms.Controllers', []);

    Controllers.controller("AlarmsController", ['$scope', 'AlarmsService', 'UserService', 'UrlRepository', 'testObj', function ($scope, AlarmsService, UserService, UrlRepository, testObj) {
        $scope.data = [];
        $scope.treedata = [];
        $scope.acknowledStatus = 0;
        $scope.checkAll = false;

        $scope.User = UserService.getUser();
        //        AlarmsService.getAlarmsTreeData().then(function(res){
        //            $scope.treedata = res.data;
        //            $scope.treedata=AlarmsService.formatForSiteHierarchy(res.data);
        //
        //
        //        },function(err){
        //            console.log("ALARMS tree data error" , err);
        //        });
        // $scope.treedata =
        $scope.treedata = AlarmsService.formatForSiteHierarchy(testObj.data.data);

        $scope.alarmData = AlarmsService.getAlarmsData($scope.sitesList[0].children[0].id);

        console.log("$scope.treeData", $scope.alarmData);

        $scope.acknowledgeAlarms = function (alarmId) {
            AlarmsService.acknowledgeAlarm(alarmId).then(function (res) {
                $scope.acknowledStatus = res;
                //$scope.updateAcknowledge(res);

            }, function (err) {
                $scope.showError(err);
            });
        };

        $scope.singleAlarmDetails = [];
        $scope.formInfo = {};
        $scope.saveData = function () {
            if ($scope.formInfo.CommentDesc) {
                var editDetails = {
                    alarmId: $scope.formInfo.commentAlarmId,
                    comment: $scope.formInfo.CommentDesc
                }
                AlarmsService.editAlarm(editDetails).then(function (res) {
                    if (res.data[0] == 1) {
                        $scope.commentedAlarmId = $scope.formInfo.commentAlarmId;
                        $scope.successRes = true;
                        if ('commentDetails' in $scope.singleAlarmDetails) {
                            $scope.singleAlarmDetails.commentDetails.push({
                                commentBy: {
                                    fullname: ""
                                },
                                commentDesc: $scope.formInfo.CommentDesc
                            });
                        } else {
                            $scope.singleAlarmDetails.commentDetails = [];
                            $scope.singleAlarmDetails.commentDetails.push({
                                commentBy: {
                                    fullname: ""
                                },
                                commentDesc: $scope.formInfo.CommentDesc
                            });
                        }
                        $scope.currentComment = $scope.currentComment + " " + $scope.formInfo.CommentDesc;
                        $scope.formInfo.CommentDesc = "";
                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.successRes = false;
                            });
                        }, 3000);
                    }
                }, function (err) {
                    $scope.showError(err);
                });
            }
        };
        $scope.clearData = function () {
            $scope.formInfo.CommentDesc = "";
            $scope.successRes = false;
            $scope.currentComment = "";
        };
    }]);

    return Controllers;

});