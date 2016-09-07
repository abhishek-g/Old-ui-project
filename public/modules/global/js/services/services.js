/**
 * Created by abhishekgoray on 11/27/14.
 */


define(['angular'], function (angular) {

    var Services = angular.module('SolarPulse.Global.Services', []);

    Services.service("WidgetTimeInterval", [function () {
        return {
            timeInterval: 600000
        }
    }]);
    Services.service("ToolTipDateFormatter", [function () {
        return {
            live: "HH:mm",
            hours: "HH:mm",
            days: "DD/MM/YYYY",
            months: "MMM/YYYY"
        }
    }]);

    Services.service("Ajaxutility", ['$http', '$q', function ($http, $q) {

        var successCallback = function () {
            console.log("SUCCESS CALLBACK NOT DEFINED");
        };
        var errorCallback = function () {
            console.log("ERROR CALLBACK NOT DEFINED");
        };

        return {
            sendRequest: function (options, success, error) {
                var success = success ? success : successCallback;
                var error = error ? error : errorCallback;

                $http(options).success(success).error(error);
            }
        };
    }]);

    Services.factory("UrlRepository", function () {
        var adminComponents = {
            users: {
                list: "/users/list",
                add: "/users/create",
                edit: "/users/edit",
                delete: "/users/disable",
                select2: "/users/listIdText"
            },
            roles: {
                list: "/roles/list",
                add: "/roles/create",
                edit: "/roles/edit",
                delete: "/roles/disable",
                select2: "/roles/listIdText"
            },
            devices: {
                list: "/devices/list",
                add: "/devices/create",
                edit: "/devices/edit",
                delete: "/devices/disable",
                select2: "/devices/listIdText",
                validate: "/devices/validate/name"
            },
            sites: {
                list: "/sites/list",
                add: "/sites/create",
                edit: "/sites/edit",
                delete: "/sites/disable",
                select2: "/sites/listIdText"
            },
            zones: {
                select2: "/zones/listIdText"
            },
            devicex: {
                list: "/roles/list",
                add: "/roles/create",
                edit: "/roles/edit",
                delete: "/roles/disable",
                select2: "/roles/listIdText"
            },
            devicetypes: {
                list: "/devicetypes/list",
                add: "/devicetypes/create",
                edit: "/devicetypes/edit",
                delete: "/devicetypes/disable",
                select2: "/roles/listIdText"
            }
        };

        return {
            checkUser: "/users/login",
            forgotPassword: "/forgetpassword",
            signUp: "/user/new",
            getAllFeatures: "/rolemanagement/getAllPrivileges",
            admin: function (component) {
                return adminComponents[component];
            },
            dashboard: {
                siteHierarchy: "/sites/hierarchy",
                sites: "/sites/status",
                sitesSummary: "/sites/siteSummary",
                zones: "/zones/status",
                inverters: "/inverters/status",
                zonesNew: "/zones/newStatus",
                inverterTemp: '/inverters/modTemp',
                siteModvsAmbTemp: '/inverters/modTempVsAmpTemp',
                inverterPowerComp: '/inverters/specificPower',
                inverterPr: '/inverters/pr',
                inverterPrs: '/inverters/prs',
                inverterParams: "/inverters/parameters",
                wsstatus: "/inverters/ws",
                WsStatusDailyPoa: "/inverters/wsDailyWhm2",
                wstempdetails: "/inverters/ambTemp",
                wsspeed: "/inverters/windSpeed",
                WindSpeedVsDirection: "/wstation/windTrend",
                wspoa: "/inverters/poa",
                sitePr: "/sites/siteAggregatePR",
                zonePr: "/zones/zoneAggregatePR",
                gmeterParams: "/inverters/gparameters",
                gmeterStatus: "inverters/gstatus",
                zonePeakPower: "/zones/zonePeakPower",
                etrends: function (view) {
                    return "/" + view.toLowerCase() + "/plantYield";
                },
                zonesAp: function (view) {
                    return "/" + view.toLowerCase() + "/specificPower";
                },
                poa: function (view) {
                    return "/" + view.toLowerCase() + "/acVSPoa";
                },
                pr: function (view) {
                    return "/" + view.toLowerCase() + "/pr";
                },
                gateways: ""
            },
            alarms: {
                get: '/inverters/site/alarmList', //'/inverters/alarms',
                acknowledge: '/inverters/alarms',
                editAlarms: '/inverters/editAlarms'
            }
        };
    });

    return Services;

});