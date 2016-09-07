/**
 * Created by abhishekgoray on 12/19/14.
 */

define(['angular'], function (angular) {

    var singleSiteControllers = angular.module('SolarPulse.SingleSite.Controllers', []);

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

    singleSiteControllers.controller("SingleSitesController", ['$scope', 'UserService', 'SitesStatus', 'ZoneStatus',
        '$rootScope', 'ResponseFormatter', 'RequestFormatter', '$interval', 'WidgetTimeInterval',
        function ($scope, UserService, SitesStatus, ZoneStatus, $rootScope, ResponseFormatter, RequestFormatter, $interval, WidgetTimeInterval) {
            $scope.iNumber = 0;
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

            $scope.isMarkerReady = false;
            /* static values end here*/

            function init() {
                $scope.singleSiteSpYield = {};
                $scope.singleSiteAlarmInfo = [];
                $scope.zonePrData = [];
                $scope.SiteDetails = {};

                $scope.ZoneDetails = [];
            }

            function showSingleSiteDashboard(date) {
                $scope.siteName = $scope.selectedNodeName;
                var reqPayLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "sites", [$scope.Site['id']]);

                var zoneIds = _.pluck($scope.Site.children[0].children, "id");

                SitesStatus.getSingleSiteStatus(reqPayLoad).then(function (res) {

                    $scope.singlePeakPower = res.peakPower;
                    $scope.SiteDetails = SitesStatus.formatResponse([$scope.abc.currentNode], res);
                    $scope.zoneCount = zoneIds.length;
                }, function (err) {});

                var reqPayLoad1 = RequestFormatter.getOptionsForSingleRequest(date, "days", "zones", _.pluck($scope.Site.children[0].children, 'id'));

                ZoneStatus.getZonesStatus(reqPayLoad1).then(function (res) {
                    $scope.ZoneDetails = res[0];
                    $scope.singleSiteSpYield = ResponseFormatter.formatYield(ZoneStatus.getSpYieldData()['data']);
                    var data = ZoneStatus.getZoneAlarms();
                    ResponseFormatter.formatForStatus(data);
                    $scope.singleSiteAlarmInfo = _.sortBy(data, 'zoneName');
                    for (var i = 0; i < $scope.singleSiteAlarmInfo.length; i++) {
                        $scope.iNumber = i;
                    }
                    $scope.zonePrData = ResponseFormatter.formatForPr(ZoneStatus.getPrComparisons()['data']);

                    $scope.$broadcast("ZoneDetailsUpdated", $scope.ZoneDetails);
                }, function (res) {

                });
            }

//            $interval(function () {
//                $rootScope.$broadcast("dateChanged");
//            }, WidgetTimeInterval.timeInterval);

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                init();
                showSingleSiteDashboard(date);

            });

        }]);

    singleSiteControllers.controller("EnergyTrendsController", ['$scope', 'DataAq', 'RequestFormatter', 'ChartResponseService',
        '$rootScope',
        function ($scope, DataAq, RequestFormatter, ChartResponseService, $rootScope, $interval, WidgetTimeInterval) {
            $scope.hideShowVal = "HideAll";
            $scope.energyTrendsData = {};
            $scope.siteName = $scope.selectedNodeName;
            $scope.viewMode = "hours";
            var reqPayLoad = {};
            range['Today'] = "hours";
            range['live'] = "hours";
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if (groupby == 'live')
                    range[groupby] = 'hours';
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDay['fDate'] = startdate;
                toSendDay['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {

                DataAq.getEnergyTrends(reqPayLoad, "sites").then(function (res) {
                        $scope.energyTrendsData = ChartResponseService.formatDataForEnergyTrend(res['plantYield'], $scope.viewMode);
                    },
                    function (err) {});
            };

            $scope.reloadWidget = function () {
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.selectedSiteId]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                $scope.siteName = $scope.selectedNodeName;
                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();
            });
        }]);

    singleSiteControllers.controller('InverterModAmbController', ['$scope', 'InvertersStatus', 'InvResDataFormatter', 'RequestFormatter',
        function ($scope, InvertersStatus, InvResDataFormatter, RequestFormatter) {
            $scope.hideShowVal = "HideAll";
            $scope.modAmbData = [];
            $scope.siteName = $scope.selectedNodeName;
            $scope.viewMode = "live";
            var reqPayLoad = {};
            range['Today'] = "hours";
            range['live'] = "hours";
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if (groupby == 'live')
                    range[groupby] = 'hours';
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", $scope.Site['id']);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {

                $scope.viewMode = range[viewMode];
                toSendDay['fDate'] = startdate;
                toSendDay['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", $scope.Site['id']);

                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {
                //console.log('req' + angular.toJson(reqPayLoad));
                $scope.modAmbData = [];
                InvertersStatus.getSiteAmbModTemperarture(reqPayLoad).then(function (res) {
                    //console.log('res here ' + JSON.stringify(res))
                    if (res.modTemp.length > 0) {
                        $scope.modAmbData = InvResDataFormatter.siteformatAmbModTemp(res.modTemp);
                    }

                }, function (err) {});
            };

            $scope.reloadWidget = function () {

                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", $scope.selectedSiteId);

                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                $scope.siteName = $scope.selectedNodeName;
                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };

                $scope.reloadWidget();
            });
        }]);

    singleSiteControllers.controller("PoaVsApController", ['$scope', 'DataAq', 'RequestFormatter', 'ChartResponseService',
        function ($scope, DataAq, RequestFormatter, ChartResponseService) {
            $scope.hideShowVal = "HideAll";
            $scope.poaVsApData = {};
            $scope.viewMode = "live";
            var reqPayLoad = {};

            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDay['fDate'] = startdate;
                toSendDay['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {
                DataAq.getPoaVsAp(reqPayLoad, "sites").then(function (res) {
                    $scope.poaVsApData = ChartResponseService.formatDataForPoaVsAp(res, "live");
                }, function (err) {});
            };

            $scope.reloadWidget = function () {

                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {

                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget(date);
            });

        }]);

    singleSiteControllers.controller("SpecificPowerController", ['$scope', 'ChartResponseService', '$rootScope', 'ResponseFormatter',
        'DataAq', 'RequestFormatter',
        function ($scope, ChartResponseService, $rootScope, ResponseFormatter, DataAq, RequestFormatter) {
            $scope.hideShowVal = "HideAll";
            $scope.specificPowerInfo = {};
            $scope.viewMode = "live";
            var reqPayLoad = {};
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDay['fDate'] = startdate;
                toSendDay['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };
            $scope.getData = function (reqPayLoad) {

                DataAq.getZoneWiseAp(reqPayLoad, "sites", $scope.viewMode).then(function (res) {
                    $scope.specificPowerInfo = (_.sortBy(ResponseFormatter.formatForZoneWiseSpPower(res.specificPower, $scope.sitesList, $scope.selectedSiteId), function (o) {
                        return o.zoneName;
                    }));
                }, function () {});
            };

            $scope.reloadWidget = function () {

                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {

                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget(date);
            });

        }]);

    singleSiteControllers.controller("PeakPowerController", ['$scope', 'ChartResponseService', '$rootScope', 'ResponseFormatter',
        'DataAq', 'RequestFormatter',
        function ($scope, ChartResponseService, $rootScope, ResponseFormatter, DataAq, RequestFormatter) {
            $scope.hideShowVal = "HideAll";
            $scope.peakPowerInfo = {};
            $scope.viewMode = "days";
            var reqPayLoad = {};
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDay['fDate'] = startdate;
                toSendDay['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };
            $scope.getData = function (reqPayLoad) {
                DataAq.getZonePeakPower(reqPayLoad, "sites", $scope.viewMode).then(function (res) {
                    $scope.peakPowerInfo = ResponseFormatter.formatPeakPower(res);
                    //console.log('peak power length' + res.peakPower[0].values.length);
                }, function () {});
            };

            $scope.reloadWidget = function () {

                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDay, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {

                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget(date);
            });

        }]);


    singleSiteControllers.controller("ZonePrController", ['$scope', '$rootScope', 'ZoneStatus', 'ResponseFormatter',
        function ($scope, $rootScope, ZoneStatus, ResponseFormatter) {
            $scope.$on("ZoneDetailsUpdated", function (context, data) {
                ZoneStatus.getPrComparisons().then(function (res) {
                    // $scope.zonePrData = ResponseFormatter.formatForPr(res.data);
                }, function () {});
            });
        }]);

    singleSiteControllers.controller("SingleSiteSpYieldController", ['$scope', '$rootScope', 'ZoneStatus', 'ResponseFormatter',
        function ($scope, $rootScope, ZoneStatus, ResponseFormatter) {
            $scope.$on("ZoneDetailsUpdated", function (context, data) {
                ZoneStatus.getSpYieldData().then(function (res) {
                    $scope.singleSiteSpYield = ResponseFormatter.formatYield(res.data);
                    $scope.updateData($scope.singleSiteSpYield);
                }, function () {});
            });
        }]);

    singleSiteControllers.controller("ZonesOverviewController", ['$scope', '$rootScope', 'ZoneStatus', 'ResponseFormatter',
        function ($scope, $rootScope, ZoneStatus, ResponseFormatter) {
            $scope.zoneOverviewData = [];
            $scope.$on("ZoneDetailsUpdated", function (context, data) {
                $scope.zoneOverviewData = [];
                $scope.getData();
            });

            $scope.getData = function () {
                ZoneStatus.getZoneOverviewData().then(function (res) {
                    ResponseFormatter.formatForCUF(res.data);
                    res.data = _.sortBy(res.data, 'zoneName');
                    var zoneAggregatedValues = ResponseFormatter.formatForZoneSummary(res.data);
                    res.data.push(zoneAggregatedValues);
                    $scope.zoneOverviewData = res.data;
                    $scope.updateData($scope.zoneOverviewData);
                }, function () {});
            }

        }]);

    singleSiteControllers.controller("CufController", ['$scope', 'RequestFormatter', 'ChartResponseService', 'DataAq',
        function ($scope, RequestFormatter, ChartResponseService, DataAq) {
            $scope.cufTrendsData = {};
            $scope.siteName = $scope.selectedNodeName;
            $scope.viewMode = "days";
            var reqPayLoad = {};
            range['Today'] = "hours";
            range['live'] = "hours";
            var toSendDateRange = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if (groupby == 'live')
                    range[groupby] = 'hours';
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDateRange['fDate'] = startdate;
                toSendDateRange['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {

                DataAq.getEnergyTrends(reqPayLoad, "sites").then(function (res) {
                        $scope.cufTrendsData = ChartResponseService.formatDataForCuf(res['plantYield'], $scope.viewMode, $scope.Site['meta']['capacity']['value']);
                    },
                    function (err) {});
            };

            $scope.reloadWidget = function () {

                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "sites", [$scope.selectedSiteId]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                $scope.siteName = $scope.selectedNodeName;
                toSendDateRange = {
                    "fDate": moment(date).subtract(6, "days").startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();
            });
        }]);

    singleSiteControllers.controller("PrTrendsController", ['$scope', 'RequestFormatter', 'ChartResponseService', 'DataAq',
        function ($scope, RequestFormatter, ChartResponseService, DataAq) {
            $scope.prTrendsData = {};
            $scope.siteName = $scope.selectedNodeName;
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
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDateRange['fDate'] = startdate.startOf("day");
                toSendDateRange['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {
                //                console.log(angular.toJson(reqPayLoad));
                DataAq.getPrData(reqPayLoad, "sites").then(function (res) {
                        //  console.log('site pr trend' + angular.toJson(res));
                        $scope.prTrendsData = ChartResponseService.formatDataForPr(res, $scope.viewMode, $scope.Site['meta']['capacity']['value']);

                    },
                    function (err) {});
            };

            $scope.reloadWidget = function () {
                reqPayLoad = RequestFormatter.getOptionsForRequest(toSendDateRange, $scope.viewMode, "sites", [$scope.Site['id']]);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                $scope.siteName = $scope.selectedNodeName;
                toSendDateRange = {
                    "fDate": moment(date).subtract(6, "days").startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();
            });
        }]);
    return singleSiteControllers;

});