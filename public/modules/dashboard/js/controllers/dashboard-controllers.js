/**
 * Created by abhishekgoray on 11/27/14.
 */

define(['angular'], function (angular) {

    var Controllers = angular.module('SolarPulse.Dashboard.Controllers', []);

    Controllers.controller("DashboardController", ['$rootScope', '$scope', 'SitesStatus', 'UserService', '$state', 'testObj',
        '$timeout', '$window', 'WidgetTimeInterval', '$interval',
        function ($rootScope, $scope, SitesStatus, UserService, $state, testObj, $timeout, $window, WidgetTimeInterval, $interval) {
            $scope.User = UserService.getUser();

            $('.js-datePicker').show();
            $scope.date = new Date();
            $scope.$watch('abc.currentNode', function (newObj, oldObj) {
                if ($scope.abc && angular.isObject($scope.abc.currentNode)) {
                    setSelectedNode($scope, $scope.abc.currentNode);
                    $scope.selectedSiteId = $scope.abc.currentNode.id;
                    $scope.selectedNodeName = $scope.abc.currentNode.label;
                    $scope.dashboardView = $scope.abc.currentNode['nav-level'];
                    $timeout(function () {
                        $scope.$broadcast($scope.dashboardView + "viewUpdated", $scope.date);
                    }, 500);
                }
            }, false);

            $scope.$on('dateChanged', function (context, date) {
                $scope.date = date;
                $scope.$broadcast($scope.dashboardView + "viewUpdated", date);
            });

            $interval(function () {
                //                console.log('test');
                $rootScope.$broadcast($scope.dashboardView + "viewUpdated");

            }, WidgetTimeInterval.timeInterval);

            function setSelectedNode($scope, node) {
                    if (node['nav-level'] === "all-sites") {
                        $scope.AllSites = node;
                    } else if (node['nav-level'] === "single-site") {
                        $scope.Site = node;
                    } else if (node['nav-level'] === "all-zones") {
                        $scope.AllZones = node;
                    } else if (node['nav-level'] === "single-zone") {
                        $scope.Zone = node;
                    } else if (node['nav-level'] === "inv-overview") {
                        $scope.Inverters = node;
                    } else if (node['nav-level'] === "single-inverter") {
                        $scope.Inverter = node;
                    } else if (node['nav-level'] === "sensorbox-overview") {
                        $scope.sensorboxes = node;
                    } else if (node['nav-level'] === "single-sensor") {
                        $scope.sensorbox = node;
                    } else if (node['nav-level'] === "gmeter") {
                        $scope.Gmeter = node;
                    }
                }
                //console.log($window);
            $scope.pathname = $window.location.pathname;
            $scope.dashboardView = "all-sites";

        }]);

    Controllers.controller("AllSitesController", ['$rootScope', '$scope', 'SitesStatus', 'UserService', '$timeout',
        'ResponseFormatter', 'AjaxLoader', 'CustomSorter', '$window', 'RequestFormatter', 'WidgetTimeInterval', '$interval',
        function ($rootScope, $scope, SitesStatus, UserService, $timeout, ResponseFormatter, AjaxLoader, CustomSorter, $window, RequestFormatter, WidgetTimeInterval, $interval) {

            $scope.iNumberDashboard = 0;
            $scope.iNumberDashboardWeather = 0;

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



            function init() {
                $scope.formattedAlarms = [];
                $scope.Details = {};
                $scope.formattedpr = [];
                $scope.formattedSPPower = [];
                $scope.formattedSPYield = [];
                $scope.sitesOverviewData = [];
                $scope.yieldValues = [];
                $scope.weatherInfo = [];
                $scope.areMarkersReady = false;
            }

            $scope.User = UserService.getUser();

            $scope.sortpr = function (direction) {
                $scope.formattedpr = CustomSorter.sort($scope.formattedpr, 'value', direction);
                $scope.$apply();
            };

            $scope.sortSpecificPower = function (direction) {
                $scope.formattedSPPower = CustomSorter.sort($scope.formattedSPPower, 'value', direction);
                $scope.$apply();
            };

            $scope.sortSpecificYield = function (direction) {
                $scope.formattedSPYield = CustomSorter.sort($scope.formattedSPYield, 'value', direction);
                $scope.$apply();
            };

            function showDashboard(date) {

                var requestPayLoad = RequestFormatter.getOptionsForSingleRequest(date, "days", "sites",
                    _.pluck($scope.sitesList[0]['children'], 'id'));

                SitesStatus.getSiteStatus(requestPayLoad).then(function (res) {

                    $scope.AllsitepeakPower = res.peakPower;

                    $timeout(function () {
                        $scope.Details = SitesStatus.formatResponse($scope.sitesList[0]['children'], res);
                    }, 300);

                    $timeout(function () {
                        SitesStatus.getAlarmsForSites($scope.sitesList).then(function (res) {
                            ResponseFormatter.formatForStatus(res.data);
                            $scope.formattedAlarms = res.data;
                            for (var i = 0; i < $scope.formattedAlarms.length; i++) {
                                $scope.iNumberDashboard = i
                            }
                        }, function (err) {
                            console.log("ERROR", err);
                        });
                    }, 500);

                    $timeout(function () {
                        SitesStatus.getPrComparisons($scope.sitesList).then(function (res) {
                            $scope.formattedpr = CustomSorter.sort(ResponseFormatter.formatForPr(res.data), 'value', true);
                        }, function (err) {
                            console.log("ERROR", err);
                        });
                    }, 700);

                    $timeout(function () {
                        SitesStatus.getSpYieldComparisons($scope.sitesList).then(function (res) {
                            $scope.formattedSPYield = CustomSorter.sort(ResponseFormatter.formatYield(res.data), 'value', true);
                        }, function (err) {
                            console.log("ERROR", err);
                        });
                    }, 900);

                    $timeout(function () {
                        SitesStatus.getSpPowerComparisons($scope.sitesList).then(function (res) {
                            $scope.formattedSPPower = CustomSorter.sort(ResponseFormatter.formatPower(res.data), 'value', true);
                        }, function (err) {
                            console.log("ERROR", err);
                        });
                    }, 1000);

                    $timeout(function () {
                        SitesStatus.getWeatherInfo($scope.sitesList).then(function (res) {
                            $scope.weatherInfo = res.data;
                            for (var i = 0; i < $scope.weatherInfo.length; i++) {
                                $scope.iNumberDashboardWeather = i
                            }
                            console.log('weather info', $scope.weatherInfo)
                        }, function (err) {

                        });
                    }, 1000)

                    $timeout(function () {
                        SitesStatus.getSitesOverViewDetails($scope.sitesList).then(function (res) {
                            ResponseFormatter.formatForCUF(res.data);

                            $scope.sitesOverviewData = res.data;
                        }, function (err) {
                            console.log("ERROR", err);
                        });
                    }, 1100);

                    $scope.$broadcast("DisplayComponents", res.data);
                    //console.log($scope);
                }, function (err) {

                    $scope.errorMessage = err.message;
                    $('#btn-danger').trigger('click');
                });
            }

            $scope.$on($scope.dashboardView + "viewUpdated", function (context, date) {
                init();
                showDashboard(date);
            });

            $scope.autoRefresh = function () {
                $window.location.reload();
            };

            $timeout(function () {
                init();
                showDashboard(new Date());
            });

        }]);

    Controllers.controller('TopWidgetsController', ['$rootScope', '$scope', function ($rootScope, $scope, SitesStatus) {

        $scope.$on("DisplayComponents", function (context, data) {
            $scope.Site = data;
            $rootScope.removeRefresh('body');
        });

    }]);

    //    Controllers.controller('SitesWeatherController', ['$scope', '$rootScope', 'SitesStatus', 'AjaxLoader',
    //        function ($scope, $rootScope, SitesStatus, AjaxLoader) {
    //            $scope.weatherInfo = [];
    //            SitesStatus.getWeatherInfo($scope.sitesList).then(function (res) {
    //                $scope.weatherInfo = res.data;
    //                console.log('weather info', $scope.weatherInfo)
    //            }, function (err) {
    //
    //            });
    //
    //        }]);

    return Controllers;
});