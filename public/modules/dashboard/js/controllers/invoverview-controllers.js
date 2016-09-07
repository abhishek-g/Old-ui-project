/**
 * Created by abhishekgoray on 1/12/15.
 */

define(['angular', 'underscore'], function (angular, _) {
    var Controllers = angular.module('SolarPulse.InvOverview.Controllers', []);
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

    Controllers.controller('InvOverviewController', ['$scope', 'InvertersStatus', 'InvResDataFormatter', '$rootScope',
        'SiteHierarchy', 'RequestFormatter', 'SitesHierarchy', '$interval', 'WidgetTimeInterval',
        function ($scope, InvertersStatus, InvResDataFormatter, $rootScope, SiteHierarchy, RequestFormatter, SitesHierarchy,
            $interval, WidgetTimeInterval) {

            function init() {
                $scope.inverterData = [];
                $scope.selectedInverter = {};
                //                $scope.selectedInverter = $scope.Inverters.children[0];
            }

            function getInvertersData(date) {
                $scope.date = date;
                var payLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "deviceSns", _.pluck($scope.Inverters.children, 'label'));
                $scope.sites = SitesHierarchy.getHierarchyObject($scope.sitesList[0].children, $scope.Inverters.children[0]['label']);

                InvertersStatus.getInvertersStatus(payLoad).then(function (res) {
                    $scope.inverterData = InvResDataFormatter.formatStatusData(res);
                    $scope.$broadcast('InvViewDetailsUpdated', {
                        FirstInverterId: $scope.inverterData[0].deviceSn,
                        date: date
                    });
                    //$scope.selectedInverter.deviceSn=$scope.inverterData[0].deviceSn;
                    $scope.updateElements = function (id) {
                        $scope.selectedInverter = _.find($scope.inverterData, function (data) {
                            return data.deviceSn === id;
                        });
                        $scope.$apply();
                    }

                }, function (err) {});
            }
            $interval(function () {
                $rootScope.$broadcast("dateChanged");
            }, WidgetTimeInterval.timeInterval);

            $scope.$on($scope.dashboardView + 'viewUpdated', function (context, date) {
                init();
                getInvertersData(date);
            });

        }]);

    Controllers.controller('InverterDcAcController', ['$scope', 'InvertersStatus', 'InvResDataFormatter', 'RequestFormatter',
        function ($scope, InvertersStatus, InvResDataFormatter, RequestFormatter) {

            $scope.AcDcData = [];
            $scope.viewMode = "live";

            $scope.$watch('selectedInverter', function (Inverter) {
                if (!$.isEmptyObject(Inverter)) {
                    doActivity(Inverter, $scope.date);
                } else {
                    $scope.showLoading();
                }
            });

            function doActivity(Inverter, date) {

                $scope.showLoading();
                var payLoad = RequestFormatter.getOptionsForSingleRequest(date, "live", "deviceSn", Inverter['label']);
                payLoad.sites = $scope.sites;
                payLoad.deviceSn = $scope.selectedInverter.deviceSn;
                InvertersStatus.getDcAcCompare(payLoad).then(function (res) {
                    if (res.activePower.length > 0) {
                        $scope.AcDcData = InvResDataFormatter.formatAcDcData(res);

                    }

                }, function (err) {});
            }
            $scope.$on('InvViewDetailsUpdated', function (context, data) {
                $scope.AcDcData = [];
                $scope.viewMode = "live";
                $scope.selectedInverter.deviceSn = data.FirstInverterId;
                doActivity($scope.Inverter || $scope.Inverters['children'][0], data.date);
            });
        }]);



    /* single inverted AC and DC controller */
    Controllers.controller('SingleInverterDcAcController', ['$scope', 'InvertersStatus', 'InvResDataFormatter', 'RequestFormatter',
        function ($scope, InvertersStatus, InvResDataFormatter, RequestFormatter) {

            $scope.singleAcDcData = [];
            $scope.viewMode = "live";

            var reqPayLoad = {};
            range['Today'] = "hours";
            range['live'] = "live";
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if (groupby == 'live')
                    range[groupby] = 'live';
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.Inverter['label']);
                $scope.showRefresh();
                doActivity(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {

                $scope.viewMode = range[viewMode];
                toSendDay['fDate'] = startdate;
                toSendDay['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.Inverter['label']);
                $scope.showRefresh();
                doActivity(reqPayLoad);
            };

            $scope.$watch('selectedInverter', function (Inverter) {
                if (!$.isEmptyObject(Inverter)) {
                    doActivity(reqPayLoad);
                } else {
                    $scope.showLoading();
                }
            });

            function doActivity(Inverter, date) {
                $scope.showLoading();
                InvertersStatus.getDcAcCompare(reqPayLoad).then(function (res) {
                    if (res.activePower.length > 0) {
                        $scope.AcDcData = InvResDataFormatter.formatAcDcData(res);
                    }
                }, function (err) {});
            }
            $scope.reloadWidget = function () {
                reqPayLoad = RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.Inverter['label']);
                $scope.showRefresh();
                doActivity(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + 'viewUpdated', function (context, date) {
                $scope.singleAcDcData = [];
                //  $scope.viewMode = "live";
                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();

            });

            $scope.$watch('inverterData', function (data) {
                if (!$.isEmptyObject(data)) {
                    $scope.singleAcDcData = [];
                    $scope.viewMode = "live";
                    $scope.selectedInverter = {};
                    $scope.selectedInverter.deviceSn = data.FirstInverterId;
                }
            });

        }]);

    Controllers.controller('InverterEfficiencyController', ['$scope', 'InvertersStatus', 'InvResDataFormatter', 'RequestFormatter',
        function ($scope, InvertersStatus, InvResDataFormatter, RequestFormatter) {
            $scope.InvEffData = [];
            $scope.viewMode = "live";
            //  $scope.viewMode = "hours";
            var reqPayLoad = {};
            range['Today'] = "hours";
            range['live'] = "live";
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if (groupby == 'live')
                    range[groupby] = 'live';
                $scope.viewMode = range[groupby];
                reqPayLoad = RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.Inverter['label']);
                $scope.showRefresh();
                doActivity(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {

                $scope.viewMode = range[viewMode];
                toSendDay['fDate'] = startdate;
                toSendDay['tDate'] = enddate;
                reqPayLoad = RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.Inverter['label']);
                $scope.showRefresh();
                doActivity(reqPayLoad);
            };


            $scope.$watch('selectedInverter', function (Inverter) {
                if (!$.isEmptyObject(Inverter)) {
                    doActivity(reqPayLoad);
                } else {
                    $scope.showLoading();
                }
            });

            function doActivity(reqPayLoad) {
                $scope.showLoading();
                InvertersStatus.getDcAcCompare(reqPayLoad).then(function (res) {

                    if (res.activePower.length > 0) {
                        $scope.InvEffData = InvResDataFormatter.formatInvEffdata(res);
                    }
                }, function (err) {});
            }
            $scope.reloadWidget = function () {
                reqPayLoad = RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.Inverter['label']);
                $scope.showRefresh();
                doActivity(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + 'viewUpdated', function (context, date) {
                $scope.InvEffData = [];
                //  $scope.viewMode = "live";
                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();
            });
        }]);

    Controllers.controller('SingleInverterController', ['$scope', 'InvertersStatus', 'InvResDataFormatter',
        'RequestFormatter', 'SitesHierarchy',
        function ($scope, InvertersStatus, InvResDataFormatter, RequestFormatter, SitesHierarchy) {
            $scope.i = 0;
            $scope.j = 0;
            $scope.slides = [0, 1];
            $scope.slides1 = [0, 1];
            $scope.acParams = {};
            $scope.temperature = {};
            $scope.inverterData = {};
            $scope.acIVs = [];
            $scope.date = {};
            $scope.dcParams = [];

            $scope.sites = SitesHierarchy.getHierarchyObject($scope.sitesList[0].children, $scope.Inverter['label']);

            function refreshInverterDashboard(date) {
                $scope.date = date;
                var payLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "deviceSns", [$scope.Inverter.label]);
                InvertersStatus.getInverterStatus(payLoad).then(function (res) {
                    $scope.inverterData = InvResDataFormatter.formatStatusData(res)[0];

                }, function () {

                });

                payLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "deviceSn", $scope.Inverter.label);

                payLoad.sites = $scope.sites;
                InvertersStatus.getParameterDetails(payLoad).then(function (res) {
                    $scope.acIVs = InvResDataFormatter.formatForAcIv(res);

                    $scope.dcParams = InvResDataFormatter.formatForDcParams(res);

                    $scope.temperature = InvResDataFormatter.formatForTemperature(res);

                }, function (err) {});

            }

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                $scope.singleInverterData = {};
                $scope.acIVs = [];
                $scope.dcParams = [];
                $scope.acParams = {};
                $scope.temperature = {};
                $scope.singleInverterData = $scope.Inverter;
                $scope.date = date;
                refreshInverterDashboard(date);
            });

        }]);

    Controllers.controller('ActivePowerController', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.activePower = undefined;

        $scope.$watch('inverterData', function (data) {
            if (!$.isEmptyObject(data)) {
                $scope.activePower = parseFloat(data.power).toFixed(2);
            } else {
                $scope.showLoading();
            }
        })

    }]);

    return Controllers;
});