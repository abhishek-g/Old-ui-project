/**
 * Created by abhishekgoray on 11/27/14.
 */

define(['angular'], function (angular) {
    "use strict";
    var Services = angular.module('SolarPulse.Home.Services', []);

    Services.service('SiteHierarchy', [function () {
        return {
            formatForSiteHierarchy: function (siteHierarchy) {
                var hierarchy = [];
                angular.forEach(siteHierarchy.sites, function (level) {
                    // console.log("level in services.js",level);
                    var zones = [];
                    var site = {
                        "id": level['_id'],
                        "label": level['name'],
                        "meta": level["meta"],
                        "lat": level["lat"],
                        "long": level["long"],
                        "location": level["location"],
                        "displayName": level['displayName'],
                        "children": [],
                        "nav-level": "single-site",
                        "collapsed": "true"
                    };

                    site.children.push({
                        "id": 1,
                        "displayName": "All Zones",
                        "nav-level": "all-zones",
                        "children": zones,
                        "collapsed": "true"
                    });

                    angular.forEach(level['zones'], function (zoneLevel) {
                        var deviceTypes = [];
                        var zone = {
                            "id": zoneLevel['_id'],
                            "label": zoneLevel['name'],
                            "meta": zoneLevel["meta"],
                            "displayName": zoneLevel['displayName'],
                            "children": deviceTypes,
                            "nav-level": "single-zone",
                            "collapsed": "true",
                            "location": zoneLevel['location']
                        };
                        angular.forEach(zoneLevel['deviceType'], function (deviceLevel, index) {
                            var devices = [];
                            var deviceType = {};
                            if (deviceLevel['_id'].toLowerCase().indexOf("inv") >= 0) {
                                deviceType = {
                                    "id": index,
                                    "label": deviceLevel['_id'],
                                    "displayName": 'INVERTER',
                                    "children": devices,
                                    "nav-level": "inv-overview",
                                    "collapsed": "true"
                                };
                                angular.forEach(deviceLevel['types'], function (device) {
                                    devices.push({
                                        "id": device['_id'],
                                        "label": device['name'],
                                        "meta": device['meta'],
                                        "displayName": device['displayName'],
                                        "nav-level": "single-inverter"
                                    })
                                });
                                deviceTypes.push(deviceType);
                            } else if (deviceLevel['_id'].toLowerCase().indexOf("gmeter") >= 0) {

                                angular.forEach(deviceLevel['types'], function (device) {
                                    deviceType = {
                                        "id": device['_id'],
                                        "label": device['name'],
                                        "nav-level": "gmeter",
                                        "displayName": device['displayName'],
                                        "meta": device['meta']
                                    };

                                    deviceTypes.push(deviceType);
                                });
                            } else if (deviceLevel['_id'].toLowerCase().indexOf("sensor") >= 0) {
                                deviceType = {
                                    "id": index,
                                    "label": deviceLevel['_id'],
                                    "children": devices,
                                    "nav-level": "sensorbox-overview",
                                    "displayName": 'SENSOR BOX',
                                    "collapsed": "true"
                                };
                                angular.forEach(deviceLevel['types'], function (deviceLevel) {
                                    devices.push({
                                        "id": deviceLevel['_id'],
                                        "label": deviceLevel['name'],
                                        "meta": deviceLevel['meta'],
                                        "displayName": deviceLevel['displayName'],
                                        "nav-level": "single-sensor"
                                    })
                                });
                                deviceTypes.push(deviceType);

                            } else if (deviceLevel['_id'].toLowerCase().indexOf("wstat") >= 0) {
                                deviceType = {
                                    "id": index,
                                    "label": deviceLevel['_id'],
                                    "children": devices,
                                    "displayName": 'WSTATION',
                                    "nav-level": "sensorbox-overview",
                                    "collapsed": "true"
                                };
                                angular.forEach(deviceLevel['types'], function (deviceLevel) {
                                    devices.push({
                                        "id": deviceLevel['_id'],
                                        "label": deviceLevel['name'],
                                        "meta": deviceLevel['meta'],
                                        "displayName": deviceLevel['displayName'],
                                        "nav-level": "single-sensor"
                                    })
                                });
                                deviceTypes.push(deviceType);

                            }
                        });
                        zones.push(zone);
                    });

                    hierarchy.push(site);
                });

                return [
                    {
                        "id": 1,
                        "displayName": "All Sites",
                        "nav-level": "all-sites",
                        "children": hierarchy
                    }
                ];
            }
        }
    }]);

    return Services;

});