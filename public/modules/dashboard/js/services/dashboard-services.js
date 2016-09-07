/**
 * Created by abhishekgoray on 11/27/14.
 */

define(['angular', 'underscore', 'moment'], function (angular, _, moment) {

    var Services = angular.module('SolarPulse.Dashboard.Services', []);

    Services.factory('SitesStatus', ['Ajaxutility', 'UrlRepository', '$q', '$timeout', function (Ajaxutility, UrlRepository, $q, $timeout) {
        var that = this;
        return {
            getSiteHierarchy: function () {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.siteHierarchy,
                    method: 'GET',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    this.SiteHierarchy = res;
                    deferred.resolve(res);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            formatResponse: function (sitesList, data) {
                // console.log('internaldata', data)

                var todayGeneration = 0,
                    totalGeneration = 0,
                    totalCapacity = 0,
                    alarms = 0,
                    sitePr = 0,
                    siteName;
                var siteInfo = [],
                    irradiance = 0;
                angular.forEach(sitesList, function (val, index) {

                    var gen = _.filter(data.energyYield, function (data) {
                        return data['_id']['site'] === val.id;
                    });
                    var poa = data.poa[0].totalPoa;

                    todayGeneration += gen.length > 0 ? gen[0]['yield'] : 0;

                    var totgen = _.filter(data.totalGen, function (data) {
                        return data['_id']['site'] === val.id;
                    });

                    totalGeneration += totgen.length > 0 ? totgen[0]['yield'] : 0;

                    totalCapacity += val.meta.capacity.value;

                    sitePr += ((todayGeneration / totalCapacity) * (1000 / poa)) * 100;
                    var siteAlarms = _.filter(data.alarmCount, function (data) {
                        return data['_id']['site'] === val.id;
                    });

                    alarms += siteAlarms.length > 0 ? siteAlarms[0]['alarmcount'] : 0;

                    siteInfo.push({
                        siteName: val.label,
                        latlng: [val['lat'], val['long']]
                    })
                });

                console.log("TOTAL GENERATION" , totalGeneration);

                return {
                    todayGeneration: todayGeneration,
                    totalGeneration: totalGeneration,
                    totalCapacity: totalCapacity,
                    alarms: alarms,
                    sites: siteInfo,
                    irradiance: irradiance,
                    sitePr: sitePr,
                    date: moment().format("DD/MM/YYYY")
                }
            },
            getSiteStatus: function (data) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.sites,
                    method: 'POST',
                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {

                    if (!$.isEmptyObject(res.data.data)) {
                        that.SitesInfo = res.data.data;
                        deferred.resolve(res.data.data);
                    } else {
                        deferred.reject({
                            message: "No Data Found "
                        });
                    }

                }, function (err) {
                    deferred.reject(err);
                });


                return deferred.promise;
            },
            getSingleSiteStatus: function (data) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.sites,
                    method: 'POST',
                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {

                    if (!$.isEmptyObject(res.data.data)) {
                        that.SitesInfo = res.data.data;
                        deferred.resolve(res.data.data);
                    } else {
                        deferred.reject({
                            message: "No Data Found "
                        });
                    }

                }, function (err) {
                    deferred.reject(err);
                });


                return deferred.promise;
            },
            getPrComparisons: function (sitesList) {
                var deferred = $q.defer();
                var prinfo = [];
                var poa = "";
                var name = "";
                angular.forEach(sitesList[0]['children'], function (val, index) {
                    var site = _.filter(that.SitesInfo.poa, function (data) {
                        return data['_id']['site'] === val.id;
                    });
                    var todayGeneration;
                    if (site.length > 0 && site[0]['_id']['orientation'] !== "common") {

                        for (var i = 0; i < site.length; i++) {
                            name = val['label'] + "_" + site[i]['_id']['orientation'];
                            poa = site[i]['totalPoa'];

                            todayGeneration = _.filter(that.SitesInfo.energyYield, function (data) {
                                return data['_id']['site'] === val.id;
                            })[0]['yield'];

                            if (poa === 0) {
                                prinfo.push({
                                    name: name,
                                    pr: 0
                                });
                            } else {
                                prinfo.push({
                                    name: name,
                                    pr: ((todayGeneration / val.meta.capacity.value) * (1000 / poa)) * 100
                                });
                            }

                        }

                    } else {
                        name = val['label'];

                        poa = site.length > 0 ? site[0]['totalPoa'] : 0;
                        todayGeneration = _.filter(that.SitesInfo.energyYield, function (data) {
                            return data['_id']['site'] === val.id;
                        });
                        todayGeneration = todayGeneration.length > 0 ? todayGeneration[0]['yield'] : 0;
                        if (poa === 0) {
                            prinfo.push({
                                name: name,
                                pr: 0
                            });
                        } else {
                            prinfo.push({
                                name: name,
                                pr: ((todayGeneration / val.meta.capacity.value) * (1000 / poa)) * 100
                            });
                        }
                    }

                });

                deferred.resolve({
                    data: prinfo
                });

                return deferred.promise;
            },
            getSpYieldComparisons: function (sitesList) {
                var deferred = $q.defer();

                var spYield = [];

                angular.forEach(sitesList[0]['children'], function (val, index) {

                    var yieldVal = _.filter(that.SitesInfo.energyYield, function (site) {
                        return site['_id']['site'] === val.id;
                    });

                    yieldVal = yieldVal.length > 0 ? yieldVal[0]['yield'] : 0;

                    spYield.push({
                        name: val.label,
                        yield: parseFloat((yieldVal / val.meta.capacity.value).toFixed(2))
                    });
                });

                $timeout(function () {
                    deferred.resolve({
                        data: spYield
                    });
                }, 20);

                return deferred.promise;
            },
            getSpPowerComparisons: function (sitesList) {
                var deferred = $q.defer();

                var spPower = [];

                angular.forEach(sitesList[0]['children'], function (val, index) {

                    var power = _.filter(that.SitesInfo.currentGeneration, function (site) {
                        return site['_id']['site'] === val.id;
                    });

                    power = power.length > 0 ? power[0]['activePower'] : 0;
                    spPower.push({
                        siteName: val.label,
                        power: (power / (val.meta.capacity.value))
                    });
                });

                deferred.resolve({
                    data: spPower
                });

                return deferred.promise;
            },
            getAlarmsForSites: function (sitesList) {
                var deferred = $q.defer();

                var alarmsInfo = [];

                try {

                    angular.forEach(sitesList[0]['children'], function (val, index) {

                        var count = _.filter(that.SitesInfo.alarmCount, function (site) {
                            return site['_id']['site'] === val.id;
                        });

                        count = count.length > 0 ? count[0]['alarmcount'] : 0;

                        var lastReportedTime = _.filter(that.SitesInfo.lastReportedTime, function (site) {
                            return site['_id']['site'] === val.id;
                        });
                        lastReportedTime = lastReportedTime.length > 0 ?
                            moment(lastReportedTime[0]['lastReportedTime']) : "-";

                        alarmsInfo.push({
                            siteName: val.label,
                            lastReportedTime: lastReportedTime,
                            alarms: count
                        });
                    });

                    deferred.resolve({
                        data: alarmsInfo
                    });
                } catch (e) {
                    deferred.reject(e);
                }

                return deferred.promise;
            },
            getSitesOverViewDetails: function (sitesList) {
                var deferred = $q.defer();

                var sitesOverviewInfo = [];

                angular.forEach(sitesList[0]['children'], function (val, index) {

                    var poaDefault = {
                        east: 0,
                        west: 0,
                        south: 0,
                        north: 0,
                        common: 0
                    };

                    var poa = _.filter(that.SitesInfo.poa, function (site) {
                        return site['_id']['site'] === val.id;
                    });

                    for (var i = 0; i < poa.length; i++) {
                        var keyT = poa[i]['_id']['orientation'].toLowerCase().trim().toString();
                        var obj = {};
                        obj[keyT] = poa[i]['totalPoa'];
                        poaDefault = _.extend({}, poaDefault, obj);
                    }

                    var power = _.filter(that.SitesInfo.currentGeneration, function (site) {
                        return site['_id']['site'] === val.id;
                    });

                    power = power.length > 0 ? power[0]['activePower'] : 0;

                    var yieldVal = _.filter(that.SitesInfo.energyYield, function (site) {
                        return site['_id']['site'] === val.id;
                    });

                    yieldVal = yieldVal.length > 0 ? yieldVal[0]['yield'] : 0;

                    var totgen = _.filter(that.SitesInfo.totalGen, function (data) {
                        return data['_id']['site'] === val.id;
                    });

                    totgen = totgen.length > 0 ? totgen[0]['yield'] : 0;

                    sitesOverviewInfo.push({
                        "siteName": val.label,
                        "installedCapacity": val.meta.capacity.value,
                        "todayGeneration": power,
                        "todayYield": yieldVal,
                        "totalYield": totgen,
                        "poaEnergy": poaDefault['common']
                    });

                });

                deferred.resolve({
                    data: sitesOverviewInfo
                });

                return deferred.promise;
            },
            getWeatherInfo: function (sites) {

                var deferred = $q.defer();
                that.weatherInfo = [];

                Ajaxutility.sendRequest({
                    url: '/sites/weather',
                    method: 'POST',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    // console.log("WEATHER INFO", res.data);
                    angular.forEach(res.data, function (weather) {
                        if ($.isEmptyObject(weather)) {
                            that.weatherInfo.push({
                                siteName: "",
                                Ambtemperature: "-",
                                Modtemperature: "-",
                                wind: "-",
                                windDirection: "-",
                                humidity: "-",
                                rainfall: "-"
                            })
                        } else {

                            var site = _.filter(sites[0]['children'], function (site) {
                                return weather['site'] === site.id;
                            })[0];

                            var siteName;
                            if (weather['Orientiation'] !== "Common") {
                                siteName = site.label + "_" + weather['Orientiation'];
                            } else {
                                siteName = site.label;
                            }

                            that.weatherInfo.push({
                                siteId: weather['site'],
                                siteName: siteName,
                                Ambtemperature: weather['AmbTmpC'] ? weather['AmbTmpC'] : "-",
                                Modtemperature: weather['MdulTmpC'] ? weather['MdulTmpC'] : "-",
                                wind: weather['WindSpeed'] ? weather['WindSpeed'] : "-",
                                windDirection: weather['WindDirection'] ? weather['WindDirection'] : "-",
                                humidity: "-",
                                rainfall: "-"
                            })
                        }
                    });

                    deferred.resolve({
                        data: that.weatherInfo
                    });
                }, function (err) {

                });

                return deferred.promise;
            },
            getSitesSummary: function (data) {

                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.sitesSummary,
                    method: 'POST',
                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    deferred.resolve(res.data.siteSummary);
                });

                return deferred.promise;
            }
        }
    }]);

    Services.service('ZoneStatus', ['Ajaxutility', 'UrlRepository', '$q', '$timeout', function (Ajaxutility, UrlRepository, $q, $timeout) {

        var that = this;
        that.zoneData = [];

        return {
            getZonesStatus: function (data) {

                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.zonesNew,
                    method: 'POST',
                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    that.zoneData = res.data[0];
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            formatZoneResponse: function (data) {
                var todayGeneration = 0,
                    totalGeneration = 0,
                    currentGeneration = 0,
                    totalCapacity = 0,
                    alarms = 0,
                    zoneName = 0,
                    siteId;
                angular.forEach(data, function (val, index) {
                    todayGeneration += val.energyYield;
                    currentGeneration += val.currentGeneration;
                    totalGeneration += val.totalYield;
                    totalCapacity += val.meta.capacity.value;
                    zoneName = val.name;
                    siteId = val.site;
                });
                return {
                    todayGeneration: todayGeneration = todayGeneration || 0,
                    currentGeneration: currentGeneration = currentGeneration || 0,
                    totalGeneration: totalGeneration = totalGeneration || 0,
                    totalCapacity: totalCapacity = totalCapacity || 0,
                    zoneName: zoneName,
                    siteId: siteId
                }
            },
            getParameterDetails: function () {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.paramdetails,
                    method: 'POST',
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
            getZoneAlarms: function (Zone) {
                var alarmsInfo = [];
                angular.forEach(that.zoneData, function (data, index) {
                    alarmsInfo.push({
                        zoneName: data.name,
                        alarms: data.alarmCount,
                        lastReportedTime: data.lastReportedTime.length >= 1 ?
                            moment(data.lastReportedTime[0]['lastReportedTime']) : "-"
                    });
                });

                return alarmsInfo;
            },
            getPrComparisons: function () {
                var prinfo = [];

                angular.forEach(that.zoneData, function (val, index) {
                    for (var i = 0; i < val.poa.length; i++) {
                        var name = "";
                        if (val.poa.length > 1) {
                            name = val['name'] + "_" + val.poa[i]['orientation'];
                        } else {
                            name = val['name'];
                        }
                        if (val.poa[i].totalPoa === 0) {
                            prinfo.push({
                                name: name,
                                pr: ((val['energyYield'] / val.meta.capacity.value) * (1000 / val.poa[i]['totalPoa'])) * 100
                            });
                        } else {
                            prinfo.push({
                                name: name,
                                pr: ((val['energyYield'] / val.meta.capacity.value) * (1000 / val.poa[i]['totalPoa'])) * 100
                            });
                        }
                    }
                });

                return {
                    data: _.sortBy(prinfo, 'pr')
                };
            },
            getSpYieldData: function () {

                var spYield = [];

                angular.forEach(that.zoneData, function (val, index) {
                    spYield.push({
                        name: val['name'],
                        yield: parseFloat((val['energyYield'] / val.meta.capacity.value).toFixed(2))
                    });
                });

                return {
                    data: _.sortBy(spYield, 'name')
                };
            },
            getZoneOverviewData: function () {
                var deferred = $q.defer();
                var spYield = [];
                angular.forEach(that.zoneData, function (val, index) {

                    var poaDefault = {
                        east: 0,
                        west: 0,
                        south: 0,
                        north: 0,
                        common: 0
                    };

                    _.each(val.poa, function (poa) {

                        var keyT = poa['orientation'].toLowerCase().trim().toString();
                        var obj = {};
                        obj[keyT] = poa['totalPoa'];
                        poaDefault = _.extend({}, poaDefault, obj);

                    });

                    spYield.push({
                        zoneName: val['name'],
                        installedCapacity: val.meta.capacity.value,
                        activePower: val.currentGeneration,
                        todayYield: val.energyYield,
                        totalYield: val['totalYield'],
                        "poaEnergy": poaDefault['common']
                    });
                });
                $timeout(function () {
                    deferred.resolve({
                        data: spYield
                    });
                }, 20);

                return deferred.promise;
            }
        }
    }]);


    Services.service('CustomSorter', ['$filter', function ($filter) {
        return {
            sort: function (data, attrToSort, isReversed) {
                return $filter('orderBy')(data, attrToSort, isReversed);
            }
        }
    }]);

    Services.service('ResponseFormatter', function () {
        return {
            formatForStatus: function (data) {
                angular.forEach(data, function (datum) {
                    var hours = parseInt(moment().format("HH"));
                    if (datum.lastReportedTime !== "-") {

                        if ((parseInt(moment().diff(datum.lastReportedTime, "minutes")) <= 60) ||
                            ((moment().diff(datum.lastReportedTime, 'days') == 1) && ((parseInt(moment().diff(datum.lastReportedTime, "minutes")) <= 720)))) {
                            datum.connectivity = true;
                        } else {
                            datum.connectivity = false;
                        }
                        datum.lastReportedTime = moment(datum.lastReportedTime).format("DD/MM/YYYY | HH:mm");
                    } else {
                        datum.connectivity = false;
                    }
                });
            },
            formatForPr: function (data) {
                var retData = [];
                angular.forEach(data, function (datum) {
                    retData.push({
                        subject: datum['name'],
                        value: datum['pr'],
                        units: "%"
                    })
                });
                return retData;
            },
            formatForDevicePr: function (data) {
                var retData = [];
                angular.forEach(data, function (datum) {
                    retData.push({
                        subject: datum['deviceSn'],
                        value: datum['pr'],
                        units: "%"
                    })
                });
                return retData;
            },
            formatYield: function (data) {
                var retData = [];
                angular.forEach(data, function (datum) {
                    retData.push({
                        subject: datum['name'],
                        value: datum['yield'],
                        units: ""
                    })
                });
                return retData;
            },
            formatPeakPower: function (data) {
                var retData = {};
                var sortedobjs = [];
                retData.zonenames = [];
                retData.peakpower = [];
                angular.forEach(data.peakPower, function (dataum) {
                    dataum.zoneName = dataum.zoneName.split("_").pop();
                    sortedobjs.push({
                        zone: dataum.zoneName + '_' + dataum.capacity + " kW",
                        peak: dataum.values[0].activePower
                    });
                });
                angular.forEach(_.sortBy(sortedobjs, 'peak').reverse(), function (singledata) {
                    retData.zonenames.push(singledata.zone);
                    retData.peakpower.push(singledata.peak);
                });
                return retData;
            },
            formatPower: function (data) {
                var retData = [];
                angular.forEach(data, function (datum) {
                    retData.push({
                        subject: datum['siteName'],
                        value: datum['power'],
                        units: ""
                    })
                });
                return retData;
            },
            formatForCUF: function (data) {
                angular.forEach(data, function (datum) {
                    datum.cuf = ((datum.todayYield) / (datum.installedCapacity * 24)) * 100;
                });
            },
            formatForSpPower: function (data, installedCapacity) {
                var spPowerInfo = [];
                angular.forEach(data, function (datum) {
                    if (datum[1] === 0) {
                        spPowerInfo.push([datum[0], 0]);
                    } else {
                        spPowerInfo.push([datum[0], datum[1] / installedCapacity]);
                    }
                });
                return spPowerInfo;
            },
            formatForZoneWiseSpPower: function (data, siteList, siteId) {
                var series = [];

                var site = _.filter(siteList[0]['children'], function (sitee) {
                    return sitee.id === siteId;
                })[0];
                var zones = site.children[0].children;

                angular.forEach(data, function (datum) {

                    var zone = _.filter(zones, function (zonee) {
                        return zonee.id === datum['zone'];
                    })[0];
                    var ap = [];

                    angular.forEach(datum['values'], function (value) {
                        ap.push([moment(value['ts']).unix() * 1000, (value['activePower'] / zone.meta.capacity.value)]);
                    });

                    series.push({
                        ap: ap,
                        zoneName: zone.label
                    })
                });
                return series;
            },
            formatForDeviceWiseSpPower: function (data, siteList, zone) {
                var series = [];
                var devices = _.filter(zone.children, function (devicees) {
                    return _.contains(['INV', 'Inverter', 'INV1'], devicees['label']);
                })[0];
                angular.forEach(data, function (datum) {
                    var devicefilter = _.filter(devices.children, function (devicee) {
                        return devicee.label === datum['deviceSn'];
                    })[0];
                    var ap = [];
                    angular.forEach(datum['values'], function (value) {
                        ap.push([moment(value['ts']).unix() * 1000, (value['activePower'] / devicefilter.meta.dcCapacity)]);
                    });

                    series.push({
                        ap: ap,
                        deviceName: devicefilter.label // "Inv" + devicefilter.label
                    })
                });
                return series;
            },
            formatForZoneYield: function (data, siteList, zone) {
                var series = [];
                //                var devices = zone.children[0].children;
                var devices = _.filter(zone.children, function (devicees) {
                    return _.contains(['INV', 'Inverter', 'INV1'], devicees['label']);
                })[0];
                angular.forEach(data, function (datum) {
                    var i = 0;
                    var filterzone = _.filter(devices, function (devicee) {
                        return devicee.id === datum['deviceSn'];
                    })[0];
                    var ap = [];
                    angular.forEach(datum['values'], function (value) {
                        ap.push([moment(value['ts']).unix() * 1000, (value['activePower'] / devices[i].meta.dcCapacity)]);
                    });

                    series.push({
                        ap: ap,
                        deviceName: devices[i].label // "Inv" + devices[i].label
                    });
                    i++;
                });
                return series;
            },
            formatForSummary: function (data, sitesList) {

                var summaryDetails = [];
                var zones = [];
                angular.forEach(sitesList, function (site) {
                    zones = _.union(zones, site['children'][0]['children']);
                });

                angular.forEach(data, function (summary) {
                    var poaDefault = {
                        east: '-',
                        west: '-',
                        south: '-',
                        north: '-',
                        common: '-'
                    };
                    var prDefault = _.extend({}, poaDefault);

                    var orientation = summary['_id']['orientation'];
                    poaDefault[orientation] = summary['totalPoa'];

                    if (summary['totalPoa'] === 0) {
                        prDefault[orientation] = 0;
                    } else {
                        prDefault[orientation] = ((summary['totalEnergy'] / summary['totalCap']) * (1000 / summary['totalPoa'])) * 100;
                    }

                    var site = _.filter(sitesList, function (site) {
                        return site['id'] === summary['_id']['site'];
                    })[0];

                    var zone = _.filter(zones, function (zone) {
                        return zone['id'] === summary['_id']['zone'];
                    })[0];


                    summaryDetails.push({
                        date: moment(summary['_id']['ts']).format("DD, MMM, YYYY"),
                        site: site['label'],
                        zone: zone['label'],
                        capacity: summary['totalCap'],
                        yield: summary['totalEnergy'],
                        prCommon: prDefault['common'],
                        prEast: prDefault['east'],
                        prWest: prDefault['west'],
                        prNorth: prDefault['north'],
                        prSouth: prDefault['south'],
                        poaCommon: poaDefault['common'],
                        poaEast: poaDefault['east'],
                        poaWest: poaDefault['west'],
                        poaNorth: poaDefault['north'],
                        poaSouth: poaDefault['south']
                    });
                });

                return summaryDetails;
            },
            formatForZoneSummary : function(data){
                var aggregatedValues = {installedCapacity:0,activePower:0,todayYield:0,totalYield:0,poaEnergy:0,cuf:0};
                angular.forEach(data,function(datum){

                    aggregatedValues.installedCapacity += datum.installedCapacity;
                    aggregatedValues.activePower += datum.activePower ? datum.activePower : 0;
                    aggregatedValues.todayYield += datum.todayYield ? datum.todayYield : 0;
                    aggregatedValues.totalYield += datum.totalYield ? datum.totalYield : 0;
                    aggregatedValues.poaEnergy += datum.poaEnergy ? datum.poaEnergy : 0;
                    aggregatedValues.cuf += datum.cuf ? datum.cuf : 0;

                });
                aggregatedValues.zoneName="-";
                console.log("TOTAL GENERATION" , aggregatedValues.totalYield);
                aggregatedValues.poaEnergy = aggregatedValues.poaEnergy/data.length;
                aggregatedValues.cuf = aggregatedValues.cuf / data.length;

                return aggregatedValues;
            }
        }
    });

    Services.factory('DataAq', ['Ajaxutility', 'UrlRepository', '$q', function (Ajaxutility, UrlRepository, $q) {
        return {
            getEnergyTrends: function (data, view) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.etrends(view),
                    method: 'POST',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    },
                    data: data
                }, function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            getPrData: function (data) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.sitePr,
                    method: 'POST',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    },
                    data: data
                }, function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            getZonePrData: function (data) {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.zonePr,
                    method: 'POST',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    },
                    data: data
                }, function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            getPoaVsAp: function (data, view) {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.poa(view),
                    method: 'POST',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    },
                    data: data
                }, function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            getZoneWiseAp: function (data, view) {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.zonesAp(view),
                    method: 'POST',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    },
                    data: data
                }, function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            getZonePeakPower: function (data, view) {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.zonePeakPower,
                    method: 'POST',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    },
                    data: data
                }, function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    }]);

    Services.factory('RequestFormatter', function () {

        return {
            getOptionsForWspeed: function (date, viewMode, siteid, deviceSn) {

                var req = {
                    "date": {
                        "from": date.fDate.toString(),
                        "to": date.tDate.toString()
                    },
                    "groupBy": viewMode
                };
                req['sites'] = siteid;
                req['deviceSn'] = deviceSn;

                return req;
            },
            getOptionsForRequest: function (date, viewMode, view, ids) {
                var req = {
                    "date": {
                        "from": date.fDate.toString(),
                        "to": date.tDate.toString()
                    },
                    "groupBy": viewMode
                };
                req[view] = ids;

                return req;
            },
            getOptionsForDateRange: function (fromDate, viewMode, view, ids) {
                var options = this.makeOptions(fromDate, viewMode);
                var req = {
                    "date": {
                        "from": options.fDate,
                        "to": options.tDate
                    },
                    "groupBy": viewMode
                };
                req[view] = ids;
                return req;
            },
            getOptionsForSingleRequest: function (fromDate, viewMode, view, ids) {
                var req = {
                    "date": {
                        "from": moment(fromDate).startOf('day').toString(),
                        "to": moment(fromDate).endOf('day').toString()
                    },
                    "groupBy": viewMode
                };
                req[view] = ids;
                return req;
            },
            makeOptions: function (fromDate, viewMode) {
                var fDate = "",
                    tDate = "";
                if (viewMode === "hours" || viewMode === "live") {
                    fDate = moment(fromDate).startOf('day').add(6, "hours").toString();
                    tDate = moment(fromDate).endOf('day').toString();
                } else if (viewMode === "days") {
                    fDate = moment(fromDate).subtract(6, 'days').startOf('day').toString();
                    tDate = moment(fromDate).subtract(1, 'days').endOf('day').toString();
                } else if (viewMode === "months") {
                    fDate = moment(fromDate).subtract(6, 'months').startOf('day').toString();
                    tDate = moment(fromDate).endOf('day').toString();
                }
                return {
                    fDate: fDate,
                    tDate: tDate
                }
            }
        };
    });

    Services.factory("ChartResponseService", function () {
        return {
            formatDataForEnergyTrend: function (data, viewMode) {
                if (viewMode === "days") {
                    return this.formatForLive(data);
                } else if (viewMode === "months") {
                    return this.formatForLive(data);
                } else if (viewMode === "hours") {
                    return this.formatForLive(data);
                }
            },
            formatDataForPoaVsAp: function (data, viewMode) {
                var poa = [],
                    ap = [];
                angular.forEach(data.ap, function (datum, index) {
                    var d = new Date(datum['ts']);
                    ap.push([moment(d).unix() * 1000, datum['activePower']]);

                });

                angular.forEach(data.poa, function (d) {
                    var dataPoints = [];

                    angular.forEach(d.dataPoints, function (point) {
                        dataPoints.push([moment(point['ts']).unix() * 1000, point['poa']]);
                    });

                    poa.push({
                        dataPoints: dataPoints,
                        deviceSn: d['deviceSn']
                    });
                });


                return {
                    poa: poa,
                    activepower: ap
                }
            },
            formatDataForCuf: function (data, viewMode, capacity) {
                var cuf = [];
                var ts = [];

                angular.forEach(data, function (d, index) {
                    var val = d['yield'] === 0 ? 0 : (d['yield'] / (capacity * getPeriod(viewMode, d['_id']['ts']))) * 100;
                    cuf.push([moment(d['_id']['ts']).unix() * 1000, val]);
                });

                function getPeriod(viewMode, date) {
                    if (viewMode === "live" || viewMode === "hours") {
                        return 1;
                    } else if (viewMode === "days") {
                        return 24;
                    } else if (viewMode === "months") {
                        return 24 * moment(date, "YYYY-MM-DD:HH:mm:ss.000Z").daysInMonth();
                    } else if (viewMode === "years") {
                        return 24 * 365;
                    }

                }

                return {
                    data: cuf,
                    ts: ts
                };
            },
            formatDataForPr: function (data, viewMode, capacity) {
                var pr = [],
                    categories = [],
                    format = {
                        days: "MM/DD/YYYY",
                        months: "MMM , YYYY"
                    };
                //console.log('main data' + angular.toJson(data));
                angular.forEach(data['plantYield'], function (yld, index) {
                    // console.log(yld['yield']);
                    var poa = _.find(data['poaEnergy'], function (node) {
                        return moment(node['_id']['ts']).format(format[viewMode]) === moment(yld['_id']['ts']).format(format[viewMode]);
                    });

                    categories.push(moment(yld['_id']['ts']).format(format[viewMode]));
                    var prVal = 0;
                    if (yld['yield'] !== 0 || poa['totalPoa'] !== 0) {
                        prVal = ((yld['yield'] / capacity) * (1000 / poa['totalPoa'])) * 100;
                    }
                    pr.push(prVal);

                });


                return {
                    data: pr,
                    categories: categories
                }

            },
            formatForLive: function (data) {
                var
                yield = [];
                var ts = [];

                angular.forEach(data, function (d, index) {
                    yield.push([moment(d['_id']['ts']).unix() * 1000, d['yield']]);
                });

                return {
                    data: yield
                };
            }
        }
    });

    Services.service('DateRanger', function () {
        var categories = [];

        return {
            days: function () {
                return {
                    getRangeInDays: function (startDate, endDate) {
                        var sDate = new Date(startDate);
                        var eDate = new Date(endDate);
                        var i = sDate.getDate();
                        categories = [];
                        while (i <= eDate.getDate()) {
                            categories.push(new Date(i, sDate.getMonth(), sDate.getFullYear()));
                            i++;
                        }
                        return categories;
                    },
                    getRangeAsPrevious: function (startDate, count) {
                        var sDate = new Date(startDate);
                        categories = [];
                        while (count >= 0) {
                            var newDate = new Date(sDate);
                            newDate.setDate(sDate.getDate() - count);
                            categories.push(moment(newDate).format("MM/DD/YYYY"));
                            count--;
                        }
                        return categories;
                    }
                };
            },
            months: function () {
                return {
                    getRangeAsPrevious: function (startDate, count) {
                        var sDate = new Date(startDate);
                        categories = [];
                        while (count >= 0) {
                            var newDate = new Date(sDate);
                            newDate.setMonth(sDate.getMonth() - count);
                            categories.push(moment(newDate).format("MMM,YY"));
                            count--;
                        }
                        return categories;
                    }
                };
            },
            years: function () {

            },
            hours: function () {

            }
        };
    });


    return Services;

});