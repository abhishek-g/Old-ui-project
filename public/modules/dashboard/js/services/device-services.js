/**
 * Created by abhishekgoray on 1/13/15.
 */

define(['angular', 'underscore'], function (angular, _) {

    var Services = angular.module("SolarPulse.InvOverview.Services", []);

    Services.factory("InvResDataFormatter", ['Ajaxutility', 'UrlRepository', function (Ajaxutility, UrlRepository) {
        var acParams = [{
            phase: "Phase A",
            current: 0,
            volts: 0
        }, {
            phase: "Phase B",
            current: 0,
            volts: 0
        }, {
            phase: "Phase C",
            current: 0,
            volts: 0
        }];

        var dcParams = {
            "pv1": [{
                label: "Dc Current (pv1)",
                value: "",
                unit: "Adc"
            }, {
                label: "Dc Voltage (pv1)",
                value: "",
                unit: "Vdc"
            }, {
                label: "Dc Power (pv1)",
                value: "",
                unit: "kW"
            }],
            "pv2": [{
                label: "Dc Current (pv2)",
                value: "",
                unit: "Adc"
            }, {
                label: "Dc Voltage (pv2)",
                value: "",
                unit: "Vdc"
            }, {
                label: "Dc Power (pv2)",
                value: "",
                unit: "kW"
            }]
        };

        var iStr = "_Current";
        var vStr = "_Voltage";

        return {
            formatStatusData: function (res) {
                var data = [];
                for (var i = 0; i < res.length; i++) {
                    data.push({
                        deviceSn: res[i]['deviceSn'],
                        inverterName: "  " + res[i]['deviceSn'],
                        power: res[i]['invActivePower'] ? res[i]['invActivePower'] : 0,
                        spPower: res[i]['invActivePower'] ? res[i]['invActivePower'] / res[i]['dcCap'] : 0,
                        yield: res[i]['energyYield'],
                        spYield: res[i]['energyYield'] / res[i]['dcCap'],
                        totYield: res[i]['totalEnergy'],
                        pr: res[i]['pr'],
                        efficiency: res[i]['invActivePower'] ? (res[i]['invActivePower'] / (res[i]['invPV1_Power'] + res[i]['invPV2_Power'])) * 100 : 0,
                        alarmCount: res[i]['alarmCount'],
                        dcCapacity: res[i]['dcCap'],
                        lastReportedTime: res[i]['lastReportedTime'],
                        displayName: res[i]['displayName']
                    });
                }
                return data;
            },
            formatAcDcData: function (res) {

                var range = [],
                    data2 = [],
                    range2 = [],
                    data = [];
                angular.forEach(res.activePower[0].values, function (value) {
                    data.push([moment(value['ts']).unix() * 1000, value['activePower']]);
                    data2.push([moment(value['ts']).unix() * 1000, value['invPV1_Power'] + value['invPV2_Power']]);
                });

                return {
                    ap: {
                        name: res.activePower[0]['deviceSn'],
                        values: data
                    },
                    pv: {
                        name: res.activePower[0]['deviceSn'],
                        values: data2
                    }
                }
            },
            formatInvEffdata: function (res) {
                var data = [];
                angular.forEach(res.activePower[0].values, function (value) {
                    var addeddata = value['invPV1_Power'] + value['invPV2_Power'];
                    var AcDcEffData = (value['activePower'] / addeddata) * 100;
                    if (addeddata == 0)
                        AcDcEffData = 0;
                    data.push([moment(value['ts']).unix() * 1000, AcDcEffData]);
                });

                return {
                    Effdata: {
                        name: res.activePower[0]['deviceSn'],
                        values: data
                    }
                }
            },
            siteformatAmbModTemp: function (res) {
                var deviceSn = [];
                var valuesData = [];
                var totalVal = [];
                var ambTemp = [];
                var modTemp = [];

                deviceSn.push(res[0].deviceSn);

                for (var i = 0; i < res.length; i++) {
                    valuesData.push(res[i].values);
                }

                for (i = 0; i < valuesData.length; i++) {
                    var localamb = [];
                    var localmod = [];
                    for (j = 0; j < valuesData[i].length; j++) {
                        localamb.push([moment(valuesData[i][j].ts).unix() * 1000, valuesData[i][j].AmbTmpC]);
                        localmod.push([moment(valuesData[i][j].ts).unix() * 1000, valuesData[i][j].MdulTmpC]);
                    }

                    ambTemp.push(localamb);
                    modTemp.push(localmod);
                }

                return [{
                    name: 'AmbTemp',
                    totalVal: ambTemp,
                    deviceSn: deviceSn
                    }, {
                    name: 'ModTemp',
                    totalVal: modTemp,
                    deviceSn: deviceSn
                    }];

            },

            formatForAcIv: function (res) {

                angular.forEach(acParams, function (param) {
                    param.current = _.filter(_.keys(res), function (data) {
                        return data.indexOf(param.phase.substring(param.phase.length - 1) + iStr) >= 0;
                    });
                    param.current = param.current.length > 0 ? res[param.current[0]] : "-";

                    param.volts = _.filter(_.keys(res), function (data) {
                        return data.indexOf(param.phase.substring(param.phase.length - 1) + vStr) >= 0;
                    });
                    param.volts = param.volts.length > 0 ? res[param.volts[0]] : "-";
                });

                return acParams;
            },
            formatForDcParams: function (res) {

                angular.forEach(dcParams.pv1, function (param) {

                    param.value = _.filter(_.keys(res), function (p) {
                        return p.indexOf("PV1_" + param.label.split(" ")[1]) >= 0;
                    });

                    param.value = _.values(_.pick(res, param.value[0]))[0];
                });

                angular.forEach(dcParams.pv2, function (param) {

                    param.value = _.filter(_.keys(res), function (p) {
                        return p.indexOf("PV2_" + param.label.split(" ")[1]) >= 0;
                    });

                    param.value = _.values(_.pick(res, param.value[0]))[0];

                });

                return dcParams;
            },
            formatForAcParams: function (res) {

                var activePower = _.filter(_.keys(res), function (key) {
                    return key.indexOf("invActivePower") >= 0;
                })[0];
                activePower = _.values(_.pick(res, activePower))[0];

                var apparentPower = _.filter(_.keys(res), function (key) {
                    return key.indexOf("invApparentPower") >= 0;
                });
                apparentPower = apparentPower.length > 0 ? _.values(_.pick(res, apparentPower))[0] : "-";

                var reactivePower = _.filter(_.keys(res), function (key) {
                    return key.indexOf("invReactivePower") >= 0;
                })[0];
                reactivePower = _.values(_.pick(res, reactivePower))[0];

                return {
                    activePower: activePower,
                    apparentPower: apparentPower,
                    reactivePower: reactivePower
                }
            },
            formatForTemperature: function (res) {

                var powerBoard = _.filter(_.keys(res), function (key) {
                    return key.indexOf("_Board") >= 0;
                });
                powerBoard = powerBoard.length > 0 ? _.values(_.pick(res, powerBoard))[0] : "-";

                var heatSink1 = _.filter(_.keys(res), function (key) {
                    return key.indexOf("Heat_Sink1") >= 0;
                });
                heatSink1 = heatSink1.length > 0 ? _.values(_.pick(res, heatSink1))[0] : "-";

                var heatSink2 = _.filter(_.keys(res), function (key) {
                    return key.indexOf("Heat_Sink2") >= 0;
                });
                heatSink2 = heatSink2.length > 0 ? _.values(_.pick(res, heatSink2))[0] : "-";

                var heatSink3 = _.filter(_.keys(res), function (key) {
                    return key.indexOf("Heat_Sink3") >= 0;
                });
                heatSink3 = heatSink3.length > 0 ? _.values(_.pick(res, heatSink3))[0] : "-";

                return {
                    powerBoard: powerBoard,
                    heatSink1: heatSink1,
                    heatSink2: heatSink2,
                    heatSink3: heatSink3
                }
            }
        }
    }]);

    Services.factory("InvertersStatus", ['Ajaxutility', 'UrlRepository', '$q', '$timeout',
        function (Ajaxutility, UrlRepository, $q, $timeout) {
            return {
                getInverterStatus: function (data) {
                    var deferred = $q.defer();

                    Ajaxutility.sendRequest({
                        url: UrlRepository.dashboard.inverterPr,
                        method: 'POST',
                        data: data,
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
                getInvertersStatus: function (data) {

                    var deferred = $q.defer();

                    Ajaxutility.sendRequest({
                        url: UrlRepository.dashboard.inverterPrs,
                        method: 'POST',
                        data: data,
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
                getDcAcCompare: function (data) {
                    var deferred = $q.defer();

                    Ajaxutility.sendRequest({
                        url: UrlRepository.dashboard.inverterPowerComp,
                        method: 'POST',
                        data: data,
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
                getAmbModTemperarture: function (data) {
                    var deferred = $q.defer();

                    Ajaxutility.sendRequest({
                        url: UrlRepository.dashboard.inverterTemp,
                        method: 'POST',
                        data: data,
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
                getSiteAmbModTemperarture: function (data) {
                    var deferred = $q.defer();

                    Ajaxutility.sendRequest({
                        url: UrlRepository.dashboard.siteModvsAmbTemp,
                        method: 'POST',
                        data: data,
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
                getParameterDetails: function (data) {
                    var deferred = $q.defer();

                    Ajaxutility.sendRequest({
                        url: UrlRepository.dashboard.inverterParams,
                        method: 'POST',
                        data: data,
                        accepts: {
                            "Content-Type": "application/json",
                            "dataType": "json"
                        }
                    }, function (res) {
                        deferred.resolve(res.data.data);
                    }, function (err) {
                        deferred.reject(err);
                    });

                    return deferred.promise;
                },
                getDeviceAlarms: function (resdata) {
                    var alarmsInfo = [];
                    angular.forEach(resdata, function (data, index) {
                        console.log('resdata', data)
                        alarmsInfo.push({
                            invName: data.deviceSn,
                            alarms: data.alarmCount,
                            lastReportedTime: data.lastReportedTime.length >= 1 ? moment(data.lastReportedTime) : '-'
                        });
                    });
                    return alarmsInfo;
                }
            }
        }]);

    Services.service("SitesHierarchy", function () {
        return {
            getHierarchyObject: function (sitesList, deviceId, searchparam) {
                var isFound = false;
                var siteId = 0;

                angular.forEach(sitesList, function (site) {
                    angular.forEach(site.children, function (zone) {
                        angular.forEach(zone.children, function (device) {
                            var devices = _.filter(device.children, function (devicees) {

                                if (searchparam)
                                    return _.contains(searchparam, devicees['label']); //.toLowerCase());
                                else
                                    return _.contains(['inv', 'inverter'], devicees['label'].toLowerCase());
                            });

                            if (devices.length > 0) {
                                var device = _.find(devices[0]['children'], function (inverter) {
                                    return inverter['label'] === deviceId;
                                });

                                if (!$.isEmptyObject(device)) {
                                    isFound = true;
                                    siteId = site['id'];
                                }
                            }
                        });
                    });
                });
                if (isFound) {
                    return siteId;
                }
                return null;
            },
            getHierarchyObjectForGmetr: function (sitesList, deviceId, pattern) {
                var isFound = false;
                var retObj = {};
                angular.forEach(sitesList, function (site) {

                    angular.forEach(site['children'][0].children, function (zone) {

                        var devices = _.filter(zone.children, function (devicees) {
                            return devicees['label'].toLowerCase().indexOf("gmeter") >= 0;
                        });

                        if (devices.length > 0) {
                            var device = _.find(devices, function (Gmeter) {
                                return Gmeter['label'] === deviceId;
                            });

                            if (!$.isEmptyObject(device)) {
                                isFound = true;
                                retObj.site = site;
                                retObj.zone = zone;
                            }
                        }
                    });
                });
                return retObj;
            }
        }
    });


    Services.factory('Weatherstation', ['Ajaxutility', 'UrlRepository', '$q', function (Ajaxutility, UrlRepository, $q) {
        return {
            formatAmbModTemp: function (res) {
                var range = [],
                    range1 = [];

                angular.forEach(res[0].values, function (data) {
                    range.push([moment(data['ts']).unix() * 1000, data['MdulTmpC']]);
                    range1.push([moment(data['ts']).unix() * 1000, data['AmbTmpC']]);
                });

                return [{
                    name: 'Module Temperature',
                    seriesData: range,
                    inverterId: res.deviceSn
                }, {
                    name: 'Ambient Temperature',
                    seriesData: range1,
                    inverterId: res.deviceSn
                }];
            },
            status: function (data, view) {
                var deferred = $q.defer();
                if (view == 'wsstatus')
                    var URL = UrlRepository.dashboard.wsstatus;
                else
                    var URL = UrlRepository.dashboard.WsStatusDailyPoa;
                Ajaxutility.sendRequest({
                    url: URL,
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
            tempdetails: function (data, view) {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.wstempdetails,
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
            WeatherCondition: function (data, view) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.pr(view),
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
            SurfaceVsAmbien: function (data, view) {
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
            WindSpeed: function (data, view) {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.wsspeed,
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
            WindSpeedVsDirection: function (data, view) {
                console.log('control inside services' + angular.toJson(data));
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.WindSpeedVsDirection,
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
            windpoa: function (data, view) {
                var deferred = $q.defer();
                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.wspoa,
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

    Services.service("GmeterStatus", ['Ajaxutility', 'UrlRepository', '$q', function (Ajaxutility, UrlRepository, $q) {

        var gridParams = [
            {
                name: "ApparentPower",
                displayName: "Apparent Power",
                unit: "kVA"
            },
            {
                name: "ActivePower",
                displayName: "Active Power",
                unit: "kW"
            },
            {
                name: "ReactivePower",
                displayName: "Reactive Power",
                unit: "KVAR"
            },
            {
                name: "PF",
                displayName: "PF",
                unit: "PF"
            },
            {
                name: "Voltage",
                displayName: "Voltage",
                unit: "V"
            },
            {
                name: "PNVoltage",
                displayName: "PN Voltage",
                unit: "V"
            },
            {
                name: "Current",
                displayName: "Current",
                unit: "A"
            }
        ];
        var defValObj = {
            Phase1: {
                value: ''
            },
            Phase2: {
                value: ''
            },
            Phase3: {
                value: ''
            }
        };
        return {
            getGmeterStatus: function (data) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.gmeterStatus,
                    method: 'POST',
                    data: data,
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
            getGmeterParameters: function (data) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.dashboard.gmeterParams,
                    method: 'POST',
                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                }, function (res) {
                    deferred.resolve(res.data.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            formatForGridParameters: function (parameters) {

                var gridResParams = [];
                var keys = _.keys(parameters);

                angular.forEach(gridParams, function (value, index) {

                    angular.forEach(_.keys(defValObj), function (val, index) {
                        defValObj[val] = parameters["grid" + val + "_" + value.name];
                    });
                    gridResParams.push(_.extend({
                        name: value.displayName,
                        unit: value.unit
                    }, defValObj));
                    // console.log(gridResParams)
                });
                return gridResParams;
            }
        }
    }]);

    return Services;
});