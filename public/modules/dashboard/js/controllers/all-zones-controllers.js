/**
 * Created by abhishekgoray on 11/27/14.
 */

define(['angular'], function (angular) {

    var Controllers = angular.module('SolarPulse.AllZones.Controllers', []);

    Controllers.controller("AllZonesController", ['$rootScope', '$scope', 'ZoneStatus', 'SitesStatus', 'ResponseFormatter',
        'AjaxLoader', '$timeout', 'RequestFormatter', '$interval', 'WidgetTimeInterval',
        function ($rootScope, $scope, ZoneStatus, SitesStatus, ResponseFormatter, AjaxLoader, $timeout, RequestFormatter, $interval, WidgetTimeInterval) {

            function init() {
                $scope.singleSiteAlarmInfo = [];
                $scope.zonePrData = [];
            }

            /* static value for slides top widgets
            @author : Pratik */

            $scope.performanceIndication = [0, 1];
            $scope.iNumberForperformanceIndication = 0;
            $scope.energyGeneration = [0];
            $scope.iNumberForEnergyGeneration = 0;

            for (var i = 0; i < $scope.performanceIndication.length; i++) {
                $scope.iNumberForperformanceIndication = i;
            }
            for (var i = 0; i < $scope.energyGeneration.length; i++) {
                $scope.iNumberForEnergyGeneration = i;
            }

            /* static values end here*/


            function showAllZonesDashboard(date) {
                    var totalNumberOfInverters = 0;
                    var totalInverters;
                    $scope.totalZoneCapacity = 0;
                    angular.forEach($scope.AllZones['children'], function (datum) {

                        totalInverters = _.filter(datum.children, function (data) {
                            return _.contains(['INV', 'Inverter', 'INV1'], data['label']);
                        });
                        $scope.totalZoneCapacity += datum.meta.capacity.value;
                        if (!$.isEmptyObject(totalInverters)) {
                            totalNumberOfInverters = totalNumberOfInverters + (totalInverters[0].children.length);
                        }
                    });
                    $scope.totalInvCount = totalNumberOfInverters;

                    var requestPayload = RequestFormatter.getOptionsForSingleRequest(date, "days", "zones", _.pluck($scope.AllZones.children, 'id'));

                    ZoneStatus.getZonesStatus(requestPayload).then(function (res) {
                        // console.log(res)
                        $scope.todayCo2Saved = [];
                        $scope.totalCo2Saved = [];
                        var todayEnergyGen = [];
                        var totalEnergyGen = [];
                        var sumTotalEnergyGen = 0;
                        var todayTotalEnergyGen = 0;
                        for (var i = 0; i < res[0].length; i++) {
                            todayEnergyGen.push(res[0][i].energyYield)
                            totalEnergyGen.push(res[0][i].totalYield)
                            todayTotalEnergyGen += todayEnergyGen[i]
                            sumTotalEnergyGen += totalEnergyGen[i]
                        }

                        $scope.todayCo2Saved = (todayTotalEnergyGen * .45) / 1000
                        $scope.totalCo2Saved = (sumTotalEnergyGen * .45) / 1000

                        $scope.ZoneDetails = res[0];
                        $scope.todaysBestGeneration = $scope.ZoneDetails[0].energyYield;

                        var data = ZoneStatus.getZoneAlarms();
                        ResponseFormatter.formatForStatus(data);
                        $scope.singleSiteAlarmInfo = data;
                        $scope.zonePrData = (_.sortBy(ResponseFormatter.formatForPr(ZoneStatus.getPrComparisons()['data']), function (o) {
                            return o.value;
                        })).reverse();
                        $scope.bestPerformingZone = $scope.zonePrData[0].subject;

                        $rootScope.$broadcast("AllZoneDetailsUpdated", $scope.ZoneDetails);

                    }, function (res) {

                    });
                }
                /*
                Snippet of code responsible for refreshing the dashboard view on selection of 'all zones' of another site
                 */
//            $interval(function () {
//                $rootScope.$broadcast("dateChanged");
//            }, WidgetTimeInterval.timeInterval);

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                showAllZonesDashboard(date ? date : new Date());
            });
        }]);

    Controllers.controller("ZoneOverviewController", ['$rootScope', '$scope', '$timeout',
        function ($rootScope, $scope, $timeout) {


            $rootScope.$on("AllZoneDetailsUpdated", function (context, data) {

                var zoneOverviewObj = [];
                //                var reqPayLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "sites", [$scope.Site['id']]);
                angular.forEach(data, function (val, index) {
                    zoneOverviewObj.push({
                        yield: Math.round(val['energyYield'] * 100) / 100,
                        capacity: Math.round(val['meta']['capacity']['value'] * 100) / 100,
                        power: Math.round(val['currentGeneration'] * 100) / 100,
                        spYield: Math.round((val['energyYield'] / val['meta']['capacity']['value']) * 100) / 100,
                        spPower: Math.round((val['currentGeneration'] / val['meta']['capacity']['value']) * 100) / 100,
                        zoneName: val.name
                    })

                });

                $timeout(function () {
                    $scope.zoneOverviewData = zoneOverviewObj;
                }, 1000);
            });


        }]);
    return Controllers;
});