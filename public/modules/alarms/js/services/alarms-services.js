/**
 * Created by abhishekgoray on 11/27/14.
 */


define(['angular', 'underscore'], function (angular, _) {

    var Services = angular.module('SolarPulse.Alarms.Services', []);

    Services.service('AlarmsService', ['Ajaxutility', 'UrlRepository', '$q', function (Ajaxutility, UrlRepository, $q) {
        var that = this;
        return {
            formatForSiteHierarchy: function (siteHierarchy) {

                var hierarchy = [];

                angular.forEach(siteHierarchy.sites, function (level) {
                    var zones = [];
                    var site = {
                        "id": level['_id'],
                        "text": level['name'],
                        "name": "sites",
                        "nodes": zones,

                    };
                    angular.forEach(level['zones'], function (zoneLevel) {
                        var deviceTypes = [];
                        var zone = {
                            "id": zoneLevel['_id'],
                            "text": zoneLevel['name'],
                            "name": "zones",
                            "nodes": deviceTypes,

                        };
                        angular.forEach(zoneLevel['deviceType'], function (deviceLevel, index) {

                            var devices = [];
                            var deviceType = {
                                "id": deviceLevel['_id'],
                                "text": deviceLevel['_id'],
                                "name": "typeName",
                                "nodes": devices

                            };
                            angular.forEach(deviceLevel['types'], function (deviceLevel) {

                                devices.push({
                                    "id": deviceLevel['name'],
                                    "text": deviceLevel['name'],
                                    "name": "deviceIds"
                                })
                            });
                            deviceTypes.push(deviceType);
                        });
                        zones.push(zone);
                    });
                    hierarchy.push(site);
                });

                return [
                    {
                        "id": 1,
                        "text": "All Sites",
                        "name": "allsites",
                        "nodes": hierarchy
                    }
                ];
            },

            getAlarmsTreeData: function () {

                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.siteHierarchy,
                    method: 'GET',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    deferred.resolve(res);

                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;

            },

            getAlarms: function (sites) {

                var deferred = $q.defer();
                var siteIds = _.keys(sites);
                Ajaxutility.sendRequest({
                    url: UrlRepository.alarms.get,
                    method: 'post',
                    data: {
                        sites: siteIds
                    },
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    deferred.resolve(res.data);

                }, function (err) {

                    deferred.reject(err);

                });

                return deferred.promise;
            },
            getAlarmsData: function (site) {
                var deferred = $q.defer();
                var siteIds = _.keys(site);
                Ajaxutility.sendRequest({
                    url: UrlRepository.alarms.get,
                    method: 'post',
                    data: {
                        site: siteIds
                    },
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    //console.log("rspns : ", res)
                    deferred.resolve(res.data);

                }, function (err) {

                    deferred.reject(err);

                });

                return deferred.promise;
            },
            acknowledgeAlarm: function (alarmIds) {

                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.alarms.acknowledge,
                    method: 'put',
                    data: {
                        alarmIds: alarmIds
                    },
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {

                    deferred.resolve(res.data);

                }, function (err) {

                    deferred.reject(err);

                });

                return deferred.promise;
            },
            editAlarm: function (editDetails) {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.alarms.editAlarms,
                    method: 'put',
                    data: {
                        editDetails: editDetails
                    },
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        }

    }]);



    return Services;

});