/**
 * Created by Sneha on 7/1/15.
 */


define(['angular', 'underscore'], function (angular, _) {

    var Controllers = angular.module('SolarPulse.SingleZone.Controllers', []);

    var range = {
        'Today': 'live',
        'live': 'live',
        'hours': 'hours',
        'days': 'days',
        'months': 'months',
        'Yesterday': 'hours',
        'Last 7 Days': 'days',
        'Last 6 Months': 'months',
        'Custom Range': 'days'
    };

    Controllers.controller("SingleZoneController", ['$rootScope', '$scope', 'ZoneStatus', 'InvertersStatus',
        'ResponseFormatter', 'AjaxLoader', '$timeout', 'RequestFormatter', '$interval', 'WidgetTimeInterval',
        function ($rootScope, $scope, ZoneStatus,
            InvertersStatus, ResponseFormatter, AjaxLoader, $timeout, RequestFormatter, $interval, WidgetTimeInterval) {

            $scope.singleZoneAlarmInfo = [];
            $scope.iNumberZone = 0;
            $scope.devicePrData = [];
            $scope.ZoneDetails = {};

            /* static value for slides top widgets
            @author : Pratik */

            $scope.performanceIndication = [0, 1, 2];
            $scope.iNumberForperformanceIndication = 0;
            $scope.energyGeneration = [0, 1];
            $scope.iNumberForEnergyGeneration = 0;
            $scope.peakPower = [0, 1];
            $scope.iNumberForpeakPower = 0;
            $scope.emissions = [0, 1];
            $scope.iNumberForemissions = 0;

            for (var i = 0; i < $scope.performanceIndication.length; i++) {
                $scope.iNumberForperformanceIndication = i;
            }
            for (var i = 0; i < $scope.energyGeneration.length; i++) {
                $scope.iNumberForEnergyGeneration = i;
            }
            for (var i = 0; i < $scope.peakPower.length; i++) {
                $scope.iNumberForpeakPower = i;
            }
            for (var i = 0; i < $scope.emissions.length; i++) {
                $scope.iNumberForemissions = i;
            }

            /* static values end here*/

            /* static values end here*/

            function showSingleZoneDashboard(date) {

                var reqPayLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "zones", [$scope.Zone.id]);
                var Inverters = _.filter($scope.abc.currentNode['children'], function (data) {
                    return _.contains(['INV', 'Inverter', 'INV1'], data['label']);
                });
                $scope.invCount = Inverters[0]['children'].length;

                ZoneStatus.getZonesStatus(reqPayLoad).then(function (res) {
                    console.log('res ===============>>>', res)
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

                    $scope.ZoneDetails = _.filter(res[0], function (data) {
                        return data['_id'] === $scope.Zone.id;
                    });
                    $scope.SingleZoneDetails = ZoneStatus.formatZoneResponse(res[0]);
                    $scope.$broadcast('zoneDetailsUpdated', {
                        zoneDetails: $scope.SingleZoneDetails,
                        date: date
                    });
                    //   $scope.zonePrData = ResponseFormatter.formatForPr(ZoneStatus.getPrComparisons()['data']);
                    var payLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "sites", $scope.SingleZoneDetails.siteId);
                    payLoad.deviceSns = _.pluck(Inverters[0]['children'], 'label');
                    InvertersStatus.getInvertersStatus(payLoad).then(function (res) {
                        //                          $scope.devicePrData = ResponseFormatter.formatForDevicePr(res);
                        var data = InvertersStatus.getDeviceAlarms(res);
                        ResponseFormatter.formatForStatus(data);
                        $scope.singleZoneAlarmInfo = data;

                        for (var i = 0; i < $scope.singleZoneAlarmInfo.length; i++) {
                            $scope.iNumberZone = i
                        }
                    }, function () {

                    });

                }, function (err) {});
            }
            $interval(function () {
                $rootScope.$broadcast("dateChanged");
            }, WidgetTimeInterval.timeInterval);

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                showSingleZoneDashboard(date ? date : new Date());
            });

        }]);

    Controllers.controller("zonePrTrendController", ['$scope', 'RequestFormatter', 'ChartResponseService', 'DataAq',
            function ($scope, RequestFormatter, ChartResponseService, DataAq) {
            $scope.viewMode = "days";
            var reqPayLoad = {};
            range['Today'] = "days";
            range['live'] = "days";
            range['Yesterday'] = "days";
            var toSendDateRange = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if (groupby == 'live')
                    range[groupby] = 'hours';
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "zones", [$scope.Zone['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                if (range[viewMode] == 'live')
                    range[viewMode] = 'days';
                $scope.viewMode = range[viewMode];
                toSendDateRange['fDate'] = startdate.startOf("day");
                toSendDateRange['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "zones", [$scope.Zone['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {
                reqPayLoad.sites = [$scope.SingleZoneDetails.siteId];
                //                console.log('reqpayload' + angular.toJson(reqPayLoad));
                DataAq.getZonePrData(reqPayLoad, "sites").then(function (res) {
                        $scope.zonePrData = ChartResponseService.formatDataForPr(res, $scope.viewMode, $scope.ZoneDetails[0].meta.capacity.value);
                    },
                    function (err) {});
            };

            $scope.reloadWidget = function () {
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "zones", [$scope.Zone['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };
            $scope.$on('zoneDetailsUpdated', function (context, data) {

                toSendDateRange = {
                    "fDate": moment(data.date).subtract(6, "days").startOf('day'),
                    "tDate": moment(data.date).endOf('day')
                };

                $scope.reloadWidget();
            });

            /*$scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                toSendDateRange = {
                    "fDate": moment(date).subtract(6, "days").startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();
            });*/
            }]);



    Controllers.controller("SingleZoneSpecificPowerController", ['$scope', 'ChartResponseService', '$rootScope', 'ResponseFormatter',
        'DataAq', 'RequestFormatter',
        function ($scope, ChartResponseService, $rootScope, ResponseFormatter, DataAq, RequestFormatter) {
            $scope.hideShowVal = "HideAll";
            $scope.specificPowerInfo = {};
            $scope.viewMode = range['Today'] = "live";
            var reqPayLoad = {};
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };
            $scope.groupByChange = function (groupby) {
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "zones", $scope.Zone['id']);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {

                $scope.viewMode = range[viewMode];
                toSendDay = {
                    "fDate": startdate,
                    "tDate": enddate
                };
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "zones", $scope.Zone['id']);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {
                DataAq.getZoneWiseAp(reqPayLoad, "zones", $scope.viewMode).then(function (res) {
                    $scope.specificPowerInfo = ResponseFormatter.formatForDeviceWiseSpPower(res.activePower, $scope.sitesList, $scope.Zone);
                }, function () {});
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                var toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "zones", $scope.Zone['id']);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            });

        }]);


    Controllers.controller("SingleZoneEnergyTrendsController", ['$scope', 'DataAq', 'RequestFormatter', 'ChartResponseService',
         function ($scope, DataAq, RequestFormatter, ChartResponseService) {
            $scope.energyTrendsData = {};
            $scope.viewMode = range['Today'] = "hours";
            var reqPayLoad = {};
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {

                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "zones", $scope.Zone['id']);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDay = {
                    "fDate": startdate,
                    "tDate": enddate
                };
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "zones", $scope.Zone['id']);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {

                DataAq.getEnergyTrends(reqPayLoad, "zones").then(function (res) {
                    $scope.energyTrendsData = ChartResponseService.formatDataForEnergyTrend(res['plantYield'], $scope.viewMode);
                }, function (err) {});
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "zones", $scope.Zone['id']);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            });

        }]);

    return Controllers;

});