/**
 * Created by abhishekgoray on 2/10/15.
 */
define(['angular'], function (angular) {

    var Controllers = angular.module('SolarPulse.Gmeter.Controller', []);


    Controllers.controller('GmeterController', ['$scope', 'GmeterStatus', 'SitesHierarchy', 'RequestFormatter','$interval', 'WidgetTimeInterval',
        function ($scope, GmeterStatus, SitesHierarchy, RequestFormatter,$interval,WidgetTimeInterval) {
            $scope.i = 0;
            $scope.slides = [0, 1];

            function init() {
                $scope.reactivePower = undefined;
                $scope.activePower = undefined;
                $scope.apparentPower = undefined;
                $scope.tYield = 0;
                $scope.alarmCount = 0;
            }

            function showDashboard(date) {
                var HrchyObj = SitesHierarchy.getHierarchyObjectForGmetr($scope.sitesList[0]['children'], $scope.Gmeter['label'], ['gmeter', 'Gmeter']);
                $scope.Site = HrchyObj.site;
                $scope.Zone = HrchyObj.zone;
                var payLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "sites", $scope.Site['id']);
                payLoad.deviceSn = $scope.Gmeter['label'];

                GmeterStatus.getGmeterStatus(payLoad).then(function (res) {

                    $scope.alarmCount = res.data[0]['alarmCount'];
                    $scope.eYield = res.energyYield['energyYield'].length > 0 ? getEnergyYield(res.energyYield['energyYield']) : 0;

                }, function () {

                });


                function getEnergyYield(yieldValues) {
                    var value = _.filter(yieldValues, function (yieldValue) {
                        return yieldValue['_id']['deviceSn'] === payLoad.deviceSn;
                    });
                    return value[0]['yield'];
                }


                GmeterStatus.getGmeterParameters(payLoad).then(function (res) {
                    $scope.gridPowerFactor = res['gridPowerFactor'];
//                    console.log('gridPowerFactor', $scope.gridPowerFactor)

                    $scope.gridFrequency = res['gridFrequency'];

                    $scope.reactivePower = parseFloat(res['gridReactivePower'].toFixed(1));
                    $scope.activePower = res['gridActivePower'];
                    $scope.apparentPower = parseFloat(res['gridApparentPower'].toFixed(1));

                    $scope.parameters = GmeterStatus.formatForGridParameters(res);
//                    console.log('params', $scope.parameters)
                    $scope.tYield = res['gridEnergyTotal'];
                }, function () {

                });
            }
            $interval(function () {
                $rootScope.$broadcast("dateChanged");
            }, WidgetTimeInterval.timeInterval);

            $scope.$on($scope.dashboardView + 'viewUpdated', function (context, date) {
                init();
                showDashboard(date);
            });

        }]);

    return Controllers;
});