/**
 * Created by harinaths on 19/8/14.
 */

var _ = require('underscore');
var async = require('async');
var db = global.db;
var ObjectId = db.ObjectId;
var moment = require('moment');
var async = require('async');

var deviceIds = ["WRTP4Q8C", "SENS0802", "WRTP4Q75"]

var eTotal = function (requestObject, cb) {

    console.log("..................,", requestObject)

    async.parallel({
        wstationList: function (cb) {
            var criteria = {
                condition: {}
            };

            if (!_.isEmpty(requestObject.sites)) {
                criteria.condition.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                criteria.condition.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                criteria.condition.name = {
                    $in: requestObject.deviceSns
                }
            }

            db.find('deviceList', criteria, function (err, docs) {
                var invWsLookup = {};
                if (docs && docs.length > 0) {
                    for (i = 0; i < docs.length; i++) {
                        invWsLookup[docs[i].name] = {
                            'wstation': docs[i].wstation,
                            dcCapacity: docs[i].dcCapacity
                        };
                    }
                }
                cb(err, invWsLookup);
            });
        },
        energyYield: function (cb) {

            var matchObj = {
                parameter: 'invEnergyTotal',
                /*ts: {
                 $gte: moment(reinvPV1_Power: function (cb) {
            var matchObj = {
                parameter: 'invPV1_Power',
                //                ts: {
                //                    $gte: moment(requestObject.date).startOf('day')._d,
                //                    $lte: moment(requestObject.date).endOf('day')._d
                //                }
                ts: {
                    $gte: requestObject.dateRange.from,
        questObject.date).startOf('day')._d,
                 $lte: moment(requestObject.date).endOf('day')._d
                 }*/
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },
        energyYieldTotal: function (cb) {
            var matchObj = {
                parameter: 'invEnergyTotal'
                    //@TODO change after discussion
                    //    ts: {
                    //                    $gte: requestObject.dateRange.from,
                    //                    $lte: requestObject.dateRange.to
                    //                }
                    //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },

        //        invActivePower:function(cb){
        //            var matchObj = {
        //                parameter: 'invActivePower',
        //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
        //            }
        //
        //            if(!_.isEmpty(requestObject.sites)){
        //                matchObj.site = requestObject.sites
        //            }
        //
        //            if(!_.isEmpty(requestObject.zones)){
        //                matchObj.zone = requestObject.zones
        //            }
        //
        //            if(requestObject.deviceSns && requestObject.deviceSns.length > 0 ){
        //                matchObj.deviceSn = {$in : requestObject.deviceSns}
        //            }
        //
        //            var criteria = [
        //                { $match: matchObj},
        //                { $project: { ts: 1, deviceId: 1, deviceSn: 1, site: 1, zone: 1, gateway: 1, invActivePower: "$current"} },
        //                { $group: { _id: {site:"$site", zone:"$zone", deviceSn:"$deviceSn"}, invActivePower:{ $avg: "$invActivePower"}}},
        //                { $sort: {deviceSn: 1} }
        //            ];
        //
        //            db.aggregate('hours', criteria, function (err, docs) {
        //
        //                if (!err && docs && docs.length > 0) {
        //                } else {
        //                    console.log(err)
        //                }
        //                cb(err, docs);
        //            });
        //        },

        invActivePower: function (cb) {
            var criteria = {
                condition: {
                    parameter: 'invActivePower',
                    ts: {
                        $gte: requestObject.dateRange.from,
                        $lte: requestObject.dateRange.to
                    }
                    //          ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
                },
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                },
                requiredFields: {
                    id: 1,
                    current: 1,
                    deviceSn: 1
                }
            };

            if (requestObject.sites) {
                criteria.condition.site = requestObject.sites;
            }

            if (requestObject.zones) {
                criteria.condition.zone = requestObject.zones;
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                criteria.condition.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            db.find('days', criteria, function (err, docs) {
                console.log(docs);
                cb(err, docs);
            });
        },



        invPV1_Power: function (cb) {
            var matchObj = {
                parameter: 'invPV1_Power',
                //                ts: {
                //                    $gte: moment(requestObject.date).startOf('day')._d,
                //                    $lte: moment(requestObject.date).endOf('day')._d
                //                }
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        invPV1_Power: "$current"
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        invPV1_Power: {
                            $avg: "$invPV1_Power"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },
        invPV2_Power: function (cb) {
            var matchObj = {
                parameter: 'invPV2_Power',
                //                ts: {
                //                    $gte: moment(requestObject.date).startOf('day')._d,
                //                    $lte: moment(requestObject.date).endOf('day')._d
                //                }
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        invPV2_Power: "$current"
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        invPV2_Power: {
                            $avg: "$invPV2_Power"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },





        irradiance: function (cb) {

            //            var matchObj = {
            //                parameter: 'POA-Energy',
            //                "deviceSn": {
            //                    $in: ['WSTATION1', '35317', '37305', '37401', '37304', '37399', '37308', '37327', '37317']
            //                },
            //                ts: {
            //                    $gte: moment(requestObject.date).startOf('day')._d,
            //                    $lte: moment(requestObject.date).endOf('day')._d
            //                }
            //            }
            var matchObj = {
                parameter: 'POA-Energy',
                "deviceSn": {
                    $in: [devconfig.ws.MANG, '35317', '37305', '37401', '37304', '37399', '37308', '37327', '37317']
                },
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                /*ts: {
                 $gte: moment(requestObject.date).startOf('day')._d,
                 $lte: moment(requestObject.date).endOf('day')._d
                 }*/
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        yield: {
                            $sum: '$yield'
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },

        alarmCount: function (cb) {
            var matchObj = {
                clearedStatus: 'NOT_CLEARED',
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                /*ts: {
                 $gte: moment(requestObject.date).startOf('day')._d,
                 $lte: moment(requestObject.date).endOf('day')._d
                 }*/
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }
            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('alarm_history', criteria, function (err, docs) {
                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        }
    }, function (err, obj) {

        console.log('Inverter energy total', obj.energyYieldTotal);
        console.log('Inverter active power', obj.invActivePower);

        var index = 0;
        var dataObj = [];

        var irrList = {};

        for (i = 0; i < obj.irradiance.length; i++) {
            var sn = obj.irradiance[i]._id.deviceSn;
            irrList[sn] = obj.irradiance[i].yield;
        }

        var totEnergyList = {}

        for (i = 0; i < obj.energyYieldTotal.length; i++) {
            var sn = obj.energyYieldTotal[i]._id.deviceSn;
            totEnergyList[sn] = obj.energyYieldTotal[i].yield;
        }

        //        console.log(JSON.stringify(totEnergyList));

        var invPowerList = {}

        for (i = 0; i < obj.invActivePower.length; i++) {
            var sn = obj.invActivePower[i].deviceSn;
            invPowerList[sn] = obj.invActivePower[i].current;
        }

        var invPV1PowerList = {}

        for (i = 0; i < obj.invPV1_Power.length; i++) {
            var sn = obj.invPV1_Power[i]._id.deviceSn;
            invPV1PowerList[sn] = obj.invPV1_Power[i].invPV1_Power;
        }

        var invPV2PowerList = {}

        for (i = 0; i < obj.invPV2_Power.length; i++) {
            var sn = obj.invPV2_Power[i]._id.deviceSn;
            invPV2PowerList[sn] = obj.invPV2_Power[i].invPV2_Power;
        }

        //        console.log(JSON.stringify(invPowerList));

        var alarmList = {};

        for (i = 0; i < obj.alarmCount.length; i++) {
            var sn = obj.alarmCount[i]._id.deviceSn;
            alarmList[sn] = obj.alarmCount[i].count;
        }

        //        console.log('Alarm List', JSON.stringify(alarmList));

        var energyIterator = function (energy, energyIteratorCB) {
            var totEnergy = totEnergyList[energy._id.deviceSn];
            var invPower = invPowerList[energy._id.deviceSn];

            var invPV1Power = invPV1PowerList[energy._id.deviceSn];

            var invPV2Power = invPV2PowerList[energy._id.deviceSn];

            var wsSn = obj.wstationList[energy._id.deviceSn].wstation;
            var dcCap = obj.wstationList[energy._id.deviceSn].dcCapacity;
            //            console.log(energy._id.deviceSn);
            if (alarmList && alarmList[energy._id.deviceSn]) {
                var alrm = alarmList[energy._id.deviceSn]
            } else {
                var alrm = 0;
            }
            if (wsSn) {
                var irradiance = irrList[wsSn]
            }

            var tempObj = {
                    deviceSn: energy._id.deviceSn,
                    energyYield: energy.yield,
                    totalEnergy: totEnergy,
                    invActivePower: invPower,
                    invPV1_Power: invPV1Power,
                    invPV2_Power: invPV2Power,
                    irradiance: irradiance,
                    dcCap: dcCap,
                    pr: ((energy.yield / dcCap) * (1000 / irradiance)) * 100,
                    alarmCount: alrm
                }
                //            console.log(tempObj);
            dataObj.push(tempObj);
            energyIteratorCB(null);
        };

        async.forEachSeries(obj.energyYield || [], energyIterator, function (err) {
            var sortedObj = _.sortBy(dataObj, 'pr');
            cb(null, sortedObj.reverse())
        });
    })
};


var prs = function (requestObject, cb) {
    async.series({
        wstationList: function (cb) {
            var criteria = {
                condition: {}
            };

            if (!_.isEmpty(requestObject.sites)) {
                criteria.condition.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                criteria.condition.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                criteria.condition.name = {
                    $in: requestObject.deviceSns
                }
            }

            db.find('deviceList', criteria, function (err, docs) {
                var invWsLookup = {};
                if (docs && docs.length > 0) {
                    for (i = 0; i < docs.length; i++) {
                        invWsLookup[docs[i].name] = {
                            'wstation': docs[i].wstation,
                            dcCapacity: docs[i].dcCapacity,
                            displayName: docs[i].displayName
                        };
                    }
                }
                cb(err, invWsLookup);
            });
        },
        energyYield: function (cb) {
            var matchObj = {
                parameter: 'invEnergyTotal',
                //                ts: {
                //                    $gte: moment(requestObject.date).startOf('day')._d,
                //                    $lte: moment(requestObject.date).endOf('day')._d
                //                }
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },
        energyYieldTotal: function (cb) {
            var matchObj = {
                parameter: 'invEnergyTotal',
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('years', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },

        invActivePower: function (cb) {
            var matchObj = {
                parameter: 'invActivePower',
                //                ts: {
                //                    $gte: moment(requestObject.date).startOf('day')._d,
                //                    $lte: moment(requestObject.date).endOf('day')._d
                //                }
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        invActivePower: "$current"
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        invActivePower: {
                            $avg: "$invActivePower"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },


        invPV1_Power: function (cb) {
            var matchObj = {
                parameter: 'invPV1_Power',
                //                ts: {
                //                    $gte: moment(requestObject.date).startOf('day')._d,
                //                    $lte: moment(requestObject.date).endOf('day')._d
                //                }
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        invPV1_Power: "$current"
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        invPV1_Power: {
                            $avg: "$invPV1_Power"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },
        invPV2_Power: function (cb) {
            var matchObj = {
                parameter: 'invPV2_Power',
                //                ts: {
                //                    $gte: moment(requestObject.date).startOf('day')._d,
                //                    $lte: moment(requestObject.date).endOf('day')._d
                //                }
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        invPV2_Power: "$current"
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        invPV2_Power: {
                            $avg: "$invPV2_Power"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },

        irradiance: function (cb) {

            var matchObj = {
                //                parameter: 'POA-Energy',
                //                    "deviceSn": {
                //                        $in: ['WSTATION1', '35317', '37305', '37401', '37304', '37399', '37308', '37327', '37317']
                //                    },
                //                    ts: {
                //                        $gte: moment(requestObject.date).startOf('day')._d,
                //                        $lte: moment(requestObject.date).endOf('day')._d
                //                    }
                parameter: 'POA-Energy',
                "deviceSn": {
                    $in: [devconfig.ws.MANG, '35317', '37305', '37401', '37304', '37399', '37308', '37327', '37317']
                },
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts : {$gte : moment(requestObject.date).startOf('day')._d , $lte : moment(requestObject.date).endOf('day')._d}
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        yield: {
                            $sum: '$yield'
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        },

        lastReportedTime: function (cb) {
            var lastReportedTimeList = {};
            var devicesIterator = function (device, deviceIteratorCB) {
                var criteria = {
                    condition: {
                        parameter: 'invEnergyTotal',
                        "deviceSn": device
                    },
                    sort: {
                        _id: -1
                    },
                    pagination: {
                        limit: 1
                    },
                    requiredFields: {
                        lastReportedTime: 1,
                        _id: 0,
                        deviceSn: 1
                    }
                }

                db.find('days', criteria, function (err, docs) {
                    if (!err && docs && docs.length) {} else {}
                    lastReportedTimeList[device] = docs[0].lastReportedTime;
                    deviceIteratorCB();
                });
            }

            var devices = requestObject.deviceSns;
            async.each(devices || [], devicesIterator, function (err) {
                cb(err, lastReportedTimeList);
            });
        },

        alarmCount: function (cb) {
            var matchObj = {
                clearedStatus: 'NOT_CLEARED',
                //                    ts: {
                //                        $gte: moment(requestObject.date).startOf('day')._d,
                //                        $lte: moment(requestObject.date).endOf('day')._d
                //                    }
                clearedStatus: 'NOT_CLEARED',
                ts: {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
                //                ts: {$gte: moment(requestObject.date).startOf('day')._d, $lte: moment(requestObject.date).endOf('day')._d}
            }

            if (requestObject.deviceSns && requestObject.deviceSns.length > 0) {
                matchObj.deviceSn = {
                    $in: requestObject.deviceSns
                }
            }
            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('alarm_history', criteria, function (err, docs) {
                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        }
    }, function (err, obj) {

        var index = 0;
        var dataObj = [];

        var irrList = {};

        for (i = 0; i < obj.irradiance.length; i++) {
            var sn = obj.irradiance[i]._id.deviceSn;
            irrList[sn] = obj.irradiance[i].yield;
        }

        var totEnergyList = {}

        for (i = 0; i < obj.energyYieldTotal.length; i++) {
            var sn = obj.energyYieldTotal[i]._id.deviceSn;
            totEnergyList[sn] = obj.energyYieldTotal[i].yield;
        }

        var invPowerList = {}

        for (i = 0; i < obj.invActivePower.length; i++) {
            var sn = obj.invActivePower[i]._id.deviceSn;
            invPowerList[sn] = obj.invActivePower[i].invActivePower;
        }


        var invPV1PowerList = {}

        for (i = 0; i < obj.invPV1_Power.length; i++) {
            var sn = obj.invPV1_Power[i]._id.deviceSn;
            invPV1PowerList[sn] = obj.invPV1_Power[i].invPV1_Power;
        }

        var invPV2PowerList = {}

        for (i = 0; i < obj.invPV2_Power.length; i++) {
            var sn = obj.invPV2_Power[i]._id.deviceSn;
            invPV2PowerList[sn] = obj.invPV2_Power[i].invPV2_Power;
        }


        var alarmList = {};

        for (i = 0; i < obj.alarmCount.length; i++) {
            var sn = obj.alarmCount[i]._id.deviceSn;
            alarmList[sn] = obj.alarmCount[i].count;
        }

        var lastReportedTimeList = {};

        for (i = 0; i < obj.lastReportedTime.length; i++) {
            var sn = obj.lastReportedTime[i]._id.deviceSn;
            lastReportedTimeList[sn] = obj.lastReportedTime[i].count;
        }

        var energyIterator = function (energy, energyIteratorCB) {
            var totEnergy = totEnergyList[energy._id.deviceSn];
            var invPower = invPowerList[energy._id.deviceSn];

            var invPV1Power = invPV1PowerList[energy._id.deviceSn];

            var invPV2Power = invPV2PowerList[energy._id.deviceSn];

            var lastRpTm = obj.lastReportedTime[energy._id.deviceSn];
            var wsSn = obj.wstationList[energy._id.deviceSn].wstation;
            var dcCap = obj.wstationList[energy._id.deviceSn].dcCapacity;
            var displayName = obj.wstationList[energy._id.deviceSn].displayName;
            if (alarmList && alarmList[energy._id.deviceSn]) {
                var alrm = alarmList[energy._id.deviceSn]
            } else {
                var alrm = 0;
            }

            if (wsSn) {
                var irradiance = irrList[wsSn]
            }
            console.log("....1111......", displayName)
            var tempObj = {
                deviceSn: energy._id.deviceSn,
                energyYield: energy.yield,
                totalEnergy: totEnergy,
                invActivePower: invPower,
                invPV1_Power: invPV1Power,
                invPV2_Power: invPV2Power,
                irradiance: irradiance,
                lastReportedTime: lastRpTm,
                displayName: displayName,
                dcCap: dcCap,
                pr: ((energy.yield / dcCap) * (1000 / irradiance)) * 100,
                alarmCount: alrm
            }
            dataObj.push(tempObj);
            energyIteratorCB(null);
        };

        async.forEachSeries(obj.energyYield || [], energyIterator, function (err) {
            var sortedObj = _.sortBy(dataObj, 'pr');

            cb(null, sortedObj.reverse())
        });
    })
};


var dataMerger = function (energyYield, irradiance, cb) {
    if (energyYield && irradiance && energyYield.length > 0 && irradiance.length > 0) {

        var index = 0;
        var data = {}
        async.eachSeries(energyYield || [], function (energy, energyIterator) {
            data[energy.ts] = {
                energyYield: energy.yield,
                irradiance: irradiance[index].yield
            }
            index++;
            energyIterator(null);
        }, function (err) {
            cb(null, data);
        });

    } else {
        cb(null, {});
    }
}


var POA = function (requestObject, cb) {
    var matchObj = {
        parameter: 'IntSolIrr wh',
        "deviceId": {
            $in: ['WRTP4Q75', 'WRTP4Q8C']
        },
        ts: {
            $gte: moment().startOf('day')._d,
            $lte: moment().endOf('day')._d
        }
    }

    if (requestObject.sites && requestObject.sites.length > 0) {
        matchObj.site = {
            $in: requestObject.sites
        }
    }

    if (requestObject.zones && requestObject.zones.length > 0) {
        matchObj.zone = {
            $in: requestObject.zones
        }
    }

    var criteria = [
        {
            $match: matchObj
        },
        {
            $project: {
                ts: 1,
                deviceId: 1,
                deviceSn: 1,
                site: 1,
                zone: 1,
                gateway: 1,
                energyyield: {
                    $subtract: ['$end', '$start']
                }
            }
        },
        {
            $project: {
                ts: "$_id.ts",
                deviceSn: "$_id.deviceSn",
                yield: "$energyyield"
            }
        },
        {
            $sort: {
                deviceSn: 1
            }
        }
    ];

    db.aggregate('days', criteria, function (err, docs) {

        if (!err && docs && docs.length > 0) {
            //            console.log(docs);
        } else {
            console.log(err)
        }
        cb(err, docs);
    });

};

var Alarms = function (requestObject, cb) {
    var criteria = {
        condition: {},
        sort: {},
        pagination: {},
        requiredFields: {}
    };

    if (!_.isEmpty(requestObject.customerId)) {
        criteria.condition.customer = requestObject.customerId;
    }

    if (requestObject.sites) {
        criteria.condition.site = requestObject.sites;
    }

    if (requestObject.zones) {
        criteria.condition.zone = requestObject.zones;
    }

    if (requestObject.deviceIds) {
        criteria.condition.deviceId = requestObject.deviceIds;
    }

    if (requestObject.dateRange) {
        criteria.condition.ts = {
            "$gte": requestObject.dateRange.from,
            $lte: requestObject.dateRange.to
        }
    }

    if (requestObject.pagination && requestObject.pagination.required) {
        if (requestObject.pagination.pageNumber && requestObject.pagination.recordsPerPage) {
            var limit = parseInt(requestObject.pagination.recordsPerPage);
            criteria.pagination['skip'] = (limit * (requestObject.pagination.pageNumber - 1));
            criteria.pagination['limit'] = limit;
        } else if (requestObject.pagination.recordsPerPage) {
            var limit = parseInt(requestObject.pagination.recordsPerPage);
            criteria.pagination['limit'] = limit;

            if (requestObject.pagination.lastRecordId) {
                criteria.condition._id = {
                    $lt: db.ObjectId(requestObject.pagination.lastRecordId.toString())
                }
            }
        }
    }

    if (!_.isEmpty(requestObject.sort)) {
        criteria.sort = requestObject.sort
    }

    db.find('alarm_history', criteria, cb);

};

var gAlarms = function (requestObject, cb) {

    var matchObject = {};

    matchObject.clearedStatus = "NOT_CLEARED";

    if (!_.isEmpty(requestObject.customerId)) {
        matchObject.customer = requestObject.customerId
    }

    if (requestObject.sites && requestObject.sites.length > 0) {
        matchObject.site = {
            $in: requestObject.sites
        }
    }

    if (requestObject.zones && requestObject.zones.length > 0) {
        matchObject.zone = {
            $in: requestObject.zones
        }
    }

    if (requestObject.devices && requestObject.devices.length > 0) {
        matchObject.deviceId = {
            $in: requestObject.devices
        }
    }

    var group = {};
    if (requestObject.groupBy == 'site') {
        group = {
            site: "$site"
        };
    } else if (requestObject.groupBy == 'zone') {
        group = {
            site: "$site",
            zone: "$zone"
        };
    } else if (requestObject.groupBy == 'device') {
        group = {
            site: "$site",
            zone: "$zone",
            deviceId: "$deviceId"
        };
    }

    var criteria = [
        {
            $match: matchObject
        },
        {
            $project: {
                deviceId: 1,
                site: 1,
                zone: 1
            }
        },
        {
            $group: {
                _id: group,
                count: {
                    $sum: 1
                }
            }
        }
    ];

    db.aggregate('alarm_history', criteria, function (err, docs) {

        if (!err && docs && docs.length > 0) {} else {
            console.log(err)
        }
        cb(err, docs);
    });
};


var alarmList = function (requestObject, cb) {

    var criteria = {
        condition: {},
        sort: {},
        pagination: {},
        requiredFields: {}
    };

    console.log("REQ OBJ : ",requestObject)

    if (!_.isEmpty(requestObject.customerId)) {
        criteria.condition.customer = requestObject.customerId;
    }

    if (requestObject.sites) {
        criteria.condition.site = requestObject.sites;
    }

    if (requestObject.zones) {
        criteria.condition.zone = requestObject.zones;
    }

    if (requestObject.deviceIds) {
        criteria.condition.deviceSn = requestObject.deviceIds;
    }

    if (requestObject.typeName) {
        criteria.condition.typeName = requestObject.typeName;
    }

    //{ $text: { $search: "coffee" } }

    var pattern = '.*'+requestObject.search+'.*';
    if (requestObject.search) {
        criteria.condition.alarmDescription = {$regex : pattern,$options:'i'};
    }

    if (requestObject.dateRange) {
        criteria.condition.ts = {
            "$gte": requestObject.dateRange.from,
            $lte: requestObject.dateRange.to
        }
    }

    if (requestObject.pagination && requestObject.pagination.required) {
        if (requestObject.pagination.pageNumber && requestObject.pagination.recordsPerPage) {
            var limit = parseInt(requestObject.pagination.recordsPerPage);
            criteria.pagination['skip'] = (limit * (requestObject.pagination.pageNumber - 1));
            criteria.pagination['limit'] = limit;
        } else if (requestObject.pagination.recordsPerPage) {
            var limit = parseInt(requestObject.pagination.recordsPerPage);
            criteria.pagination['limit'] = limit;

            if (requestObject.pagination.lastRecordId) {
                criteria.condition._id = {
                    $lt: db.ObjectId(requestObject.pagination.lastRecordId.toString())
                }
            }
        }
    }

    if (!_.isEmpty(requestObject.sort)) {
        criteria.sort = requestObject.sort
    } else {
        criteria.sort = {
            "ts": -1
        };
    }
    db.find('alarm_history', criteria, function(err, docs){
        cb(err, docs)});
};

var alarmCount = function (requestObject, cb) {

    var criteria = {
        condition: {}
    };

    if (!_.isEmpty(requestObject.customerId)) {
        criteria.condition.customer = requestObject.customerId;
    }

    if (requestObject.sites) {
        criteria.condition.site = requestObject.sites;
    }

    if (requestObject.zones) {
        criteria.condition.zone = requestObject.zones;
    }

    if (requestObject.deviceIds) {
        criteria.condition.deviceSn = requestObject.deviceIds;
    }

    if (requestObject.typeName) {
        criteria.condition.typeName = requestObject.typeName;
    }

    if (requestObject.dateRange) {
        criteria.condition.ts = {
            "$gte": requestObject.dateRange.from,
            $lte: requestObject.dateRange.to
        }
    }
    db.count('alarm_history', criteria, cb);
};

var updateAlarms = function (requestObject, cb) {
    var updateObject = {
        acknowledged: true,
        acknowledgedBy: {
            _id: requestObject.user._id,
            fullname: requestObject.user.fullname,
            ts: new Date()
        }
    }

    var updateObj = {
        condition: {
            _id: {
                $in: requestObject.alarms
            }
        },
        value: {
            $set: updateObject
        },
        options: {
            multi: true,
            upsert: false
        }
    };

    db.update('alarm_history', updateObj, cb);
};

var newStatus = function (requestObject, cb) {

    var criteria = {
        condition: {},
        sort: {},
        pagination: {}
    };

    if (!_.isEmpty(requestObject.site)) {
        criteria.condition.site = requestObject.site
    }

    if (!_.isEmpty(requestObject.zone)) {
        criteria.condition._id = requestObject.zone
    }

    /* DB Query*/
    db.find('devices', criteria, function (err, devices) {

        if (!err && devices && devices.length > 0) {

            var zonesIterator = function (zone, zoneIteratorCB) {


                async.series({
                    energyYield: function (selfCB) {
                        var matchObj = {
                            "_id.zone": zone._id,
                            "_id.ts": {
                                $gte: moment(requestObject.date).startOf('day')._d,
                                $lte: moment(requestObject.date).endOf('day')._d
                            }
                        }

                        var criteria = [
                            {
                                $match: matchObj
                            },
                            {
                                $project: {
                                    "yield": 1
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        zone: "$_id.zone"
                                    },
                                    yield: {
                                        $sum: '$yield'
                                    }
                                }
                            }
                        ];

                        db.aggregate('energyGeneration', criteria, function (err, docs) {

                            if (!err && docs && docs.length > 0) {
                                selfCB(null, docs[0]["yield"])
                            } else {
                                selfCB(err, 0);

                            }
                        });
                    },
                    totalYield: function (selfCB) {
                        var matchObj = {
                            "_id.zone": zone._id
                        }

                        var criteria = [
                            {
                                $match: matchObj
                            },
                            {
                                $project: {
                                    "yield": 1
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        zone: "$_id.zone"
                                    },
                                    yield: {
                                        $sum: '$yield'
                                    }
                                }
                            }
                        ];

                        db.aggregate('energyGeneration', criteria, function (err, docs) {

                            if (!err && docs && docs.length > 0) {
                                console.log('Total Energy Generation:' + JSON.stringify(docs));
                                selfCB(null, docs[0]["yield"])
                            } else {
                                selfCB(err, 0);

                            }

                        });
                    },
                    poa: function (selfCB) {
                        var matchObj = {
                            "_id.zone": zone._id,
                            "_id.ts": {
                                $gte: moment(requestObject.date).startOf('day')._d,
                                $lte: moment(requestObject.date).endOf('day')._d
                            }
                        }

                        var criteria = [
                            {
                                $match: matchObj
                            },
                            {
                                $project: {
                                    "capacity.value": 1,
                                    "orientation": 1,
                                    "energyGenreation": 1,
                                    "poa": 1
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        zone: "$_id.zone",
                                        orientation: "$orientation"
                                    },
                                    totalCap: {
                                        $sum: '$capacity.value'
                                    },
                                    totalEnergy: {
                                        $sum: '$energyGenreation'
                                    },
                                    totalPoa: {
                                        $sum: '$poa'
                                    }
                                }
                            },
                            {
                                $project: {
                                    "orientation": '$_id.orientation',
                                    "totalCap": 1,
                                    "totalEnergy": 1,
                                    "totalPoa": 1,
                                    _id: 0
                                }
                            }

                        ];

                        db.aggregate('poaGeneration', criteria, function (err, docs) {

                            if (!err && docs && docs.length > 0) {
                                selfCB(err, docs);
                            } else {
                                selfCB(err, 0);
                            }

                        });
                    },
                    currentGeneration: function (selfCB) {
                        var matchObj = {
                            "_id.zone": zone._id,
                            "_id.ts": {
                                $gte: moment(requestObject.date).startOf('day')._d,
                                $lte: moment(requestObject.date).endOf('day')._d
                            }
                        }

                        var criteria = [
                            {
                                $match: matchObj
                            },
                            {
                                $project: {
                                    "activePower": 1
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        zone: "$_id.zone"
                                    },
                                    activePower: {
                                        $sum: '$activePower'
                                    }
                                }
                            }
                        ];

                        db.aggregate('activePowerGeneration', criteria, function (e, docs) {
                            if (!err && docs && docs.length > 0) {
                                selfCB(null, docs[0]["activePower"])

                            } else {

                                selfCB(err, 0);
                            }
                        });
                    }

                }, function (err, dataObj) {
                    _.extend(zone, dataObj);
                    zoneIteratorCB(null)
                })
            }

            async.each(zones || [], zonesIterator, function (err) {
                cb(null, zones);
            });
        } else {
            cb(null, null)
        }
    });
};

var invCommunicationStatus = function (requestObject, cb) {

    var criteria = {
        condition: {
            "typeName": {
                $in: ["Inverter", "INV"]
            }
        },
        sort: {},
        pagination: {}
    };

    if (!_.isEmpty(requestObject.sites)) {
        criteria.condition.site = requestObject.sites
    }

    if (!_.isEmpty(requestObject.zones)) {
        criteria.condition.zone = requestObject.zones
    }

    db.find('devices', criteria, function (err, devices) {
        if (!err && devices && devices.length > 0) {

            var devicesIterator = function (device, deviceIteratorCB) {
                async.parallel({

                    lastReportedTime: function (selfcb) {
                        var criteria = {
                            condition: {
                                parameter: 'invEnergyTotal',
                                "device": device._id
                            },
                            sort: {
                                _id: -1
                            },
                            pagination: {
                                limit: 1
                            },
                            requiredFields: {
                                lastReportedTime: 1,
                                _id: 0,
                                deviceSn: 1
                            }
                        }

                        db.find('days', criteria, function (e, docs) {
                            if (!err && docs && docs.length) {} else {}
                            selfcb(err, docs);
                        });
                    },
                    alarmCount: function (selfcb) {

                        var criteria = {
                            condition: {
                                "device": device._id,
                                "clearedStatus": "NOT_CLEARED"
                            },
                            sort: {},
                            pagination: {},
                            requiredFields: {}
                        }

                        db.count('alarm_history', criteria, function (e, docs) {
                            if (!err && docs && docs.length) {} else {
                                console.log(err)
                            }
                            selfcb(err, docs);
                        });
                    }

                }, function (err, dataObj) {
                    _.extend(device, dataObj);
                    deviceIteratorCB(null)
                })
            }

            async.each(devices || [], devicesIterator, function (err) {

                cb(null, devices);
            });

        } else {
            cb(null, null)
        }
    });
}

var activePowerTrend = function (req, res) {
    async.parallel({

        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                zoneService.activePowerForCurrentDay(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.activePower

            }
            res.send(response);

        })
    });
};


var editAlarms = function (requestObject, cb) {
    var updateObject = {
        commentDetails: {
            commentDesc: requestObject.comment,
            commentBy: {
                _id: requestObject.user._id,
                fullname: requestObject.user.fullname
            },
            ts: new Date()
        }

    };

    var updateObj = {
        condition: {
            _id: requestObject.alarms
        },
        value: {
            $addToSet: updateObject
        },
        options: {
            multi: true,
            upsert: false
        }
    };
    console.log("alarm updateObj", updateObj);
    db.update('alarm_history', updateObj, cb);
};

var activePowerForCurrentDay = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    db.find('devices', deviceCriteria, function (err, devices) {

        if (devices && devices.length) {
            console.log('Devices', devices);
            async.series({

                activePower: function (selfcb) {

                    var matchObj = {
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }
                    }

                    if (requestObject.sites) {
                        matchObj.site = requestObject.sites.toString()
                    }

                    if (requestObject.zones) {
                        matchObj.zone = requestObject.zones.toString()
                    }

                    if (requestObject.deviceSn) {
                        matchObj.deviceTypeId = requestObject.deviceSn.toString()
                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceTypeId",
                                ts: "$_h"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceTypeId",
                                ts: "$_d"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceTypeId",
                                ts: "$_mo"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceTypeId",
                                ts: "$_y"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceTypeId",
                                ts: "$_dt"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                deviceId: "$_id.deviceId",
                                activePower: "$activePower",
                                invActivePower: "$invActivePower",
                                invPV1_Power: "$invPV1_Power",
                                invPV2_Power: "$invPV2_Power"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'activePower': '$activePower',
                                        'invPV1_Power': '$invPV1_Power',
                                        'invPV2_Power': '$invPV2_Power'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]


                    db.aggregate('inv_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {

                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }
            }, function (err, data) {

                cb(err, data)
            })
        } else {
            async.series({
                activePower: function (selfcb) {

                    var matchObj = {
                        ts: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }
                        //                        deviceSn : {$nin : ["35317", "37305", "37399", "37308", "37327", "37401", "37304", "37317"]}
                    }


                    if (requestObject.deviceSn) {
                        matchObj.deviceSn = requestObject.deviceSn.toString()
                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceSn",
                                ts: "$_h"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceSn",
                                ts: "$_d"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }


                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceSn",
                                ts: "$_mo"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceSn",
                                ts: "$_y"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                deviceId: "$deviceSn",
                                ts: "$_mi"
                            },
                            activePower: {
                                "$avg": "$invActivePower"
                            },
                            invPV1_Power: {
                                "$avg": "$invPV1_Power"
                            },
                            invPV2_Power: {
                                "$avg": "$invPV2_Power"
                            }
                        }
                    }

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                deviceId: "$_id.deviceId",
                                activePower: "$activePower",
                                invPV1_Power: "$invPV1_Power",
                                invPV2_Power: "$invPV2_Power"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'activePower': '$activePower',
                                        'invPV1_Power': '$invPV1_Power',
                                        'invPV2_Power': '$invPV2_Power'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('message_history', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {

                            //console.log(docs)
                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }

            }, function (err, data) {
                cb(err, data)
            })
        }
    });
};


var energyYield = function (requestObject, cb) {
    async.series({
        energyYield: function (cb) {
            var matchObj = {
                parameter: 'invEnergyTotal',
                ts: {
                    "$gte": requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        }
    }, function (err, data) {
        cb(err, data)
    })
};


//newly added for site wise ModTemp VS AmpTemp


var modTempVSAmpTempForSite = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length) {
            async.series({

                modTemp: function (selfcb) {
                    var matchObj = {
                        //                        _dt: {
                        //                                $gte: requestObject.dateRange.from,
                        //                                $lte: requestObject.dateRange.to
                        //                            },
                        //                            deviceTypeId: "WSTATION1"
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        },
                        deviceTypeId: devconfig.ws.MANG
                    }

                    if (requestObject.sites) {
                        matchObj.site = requestObject.sites.toString()
                    }

                    if (requestObject.zones) {
                        matchObj.zone = requestObject.zones.toString()
                    }

                    //                    if(requestObject.deviceSn){
                    //                        matchObj.deviceSn =  requestObject.deviceSn.toString()
                    //                    }

                    console.log(matchObj);

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_h"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_d"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_mo"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_y"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_dt"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    console.log('Group id', group_id);

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                MdulTmpC: "$MdulTmpC",
                                AmbTmpC: "$AmbTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'MdulTmpC': '$MdulTmpC',
                                        'AmbTmpC': '$AmbTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('wstation_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {

                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }
            }, function (err, data) {

                cb(err, data)
            })
        } else {
            async.series({
                modTemp: function (selfcb) {

                    var matchObj = {
                        ts: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        },
                        "typeName": "Sensor Box"
                            //                        deviceSn : {$nin : ["35317", "37305", "37399", "37308", "37327", "37401", "37304", "37317"]}
                    }

                    if (requestObject.sites) {
                        matchObj.site = requestObject.sites
                    }

                    if (requestObject.deviceSn) {
                        matchObj.deviceSn = requestObject.deviceSn.toString()
                    }
                    console.log(matchObj);
                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_h"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_d"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }


                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mo"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_y"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mi"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                AmbTmpC: "$AmbTmpC",
                                MdulTmpC: "$MdulTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'AmbTmpC': '$AmbTmpC',
                                        'MdulTmpC': '$MdulTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }

                    ]

                    db.aggregate('message_history', criteria, function (err, docs) {
                        if (!err && docs && docs.length) {
                            console.log("wstation logs.....", docs.length)
                            for (var i in docs) {

                                if (docs[i].values.length > 1) {

                                    for (var j in docs[i].values) {
                                        if (docs[i].values[j].AmbTmpC < 0) {
                                            //console.log("values : ",docs[i].values[j].AmbTmpC);
                                            docs[i].values[j].AmbTmpC = 0;
                                            //console.log("after change : ",docs[i].values[j].AmbTmpC);
                                        }

                                    }
                                }

                            }
                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }

            }, function (err, data) {
                cb(err, data)
            })
        }
    });
};


var modTempForCurrentDay = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length) {
            async.series({

                modTemp: function (selfcb) {
                    var matchObj = {
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        },
                        deviceTypeId: "WSTATION1"
                    }

                    if (requestObject.sites) {
                        matchObj.site = requestObject.sites.toString()
                    }

                    if (requestObject.zones) {
                        matchObj.zone = requestObject.zones.toString()
                    }

                    //                    if(requestObject.deviceSn){
                    //                        matchObj.deviceSn =  requestObject.deviceSn.toString()
                    //                    }

                    console.log(matchObj);

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_h"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_d"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_mo"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_y"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_dt"
                            },
                            MdulTmpC: {
                                "$avg": "$MdulTmpC"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    console.log('Group id', group_id);

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                MdulTmpC: "$MdulTmpC",
                                AmbTmpC: "$AmbTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'MdulTmpC': '$MdulTmpC',
                                        'AmbTmpC': '$AmbTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('wstation_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {

                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }
            }, function (err, data) {

                cb(err, data)
            })
        } else {
            async.series({
                modTemp: function (selfcb) {

                    var matchObj = {
                        ts: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }
                        //                        deviceSn : {$nin : ["35317", "37305", "37399", "37308", "37327", "37401", "37304", "37317"]}
                    }

                    if (requestObject.sites) {
                        matchObj.deviceSn = requestObject.sites.toString()
                    }

                    if (requestObject.deviceSn) {
                        matchObj.deviceSn = requestObject.deviceSn.toString()
                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_h"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_d"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }


                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mo"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_y"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mi"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            },
                            "MdulTmpC": {
                                "$avg": "$MdulTmpC"
                            }
                        }
                    }

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                AmbTmpC: "$AmbTmpC",
                                MdulTmpC: "$MdulTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'AmbTmpC': '$AmbTmpC',
                                        'MdulTmpC': '$MdulTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('message_history', criteria, function (err, docs) {
                        if (!err && docs && docs.length) {

                            //console.log(docs)
                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }

            }, function (err, data) {
                cb(err, data)
            })
        }
    });
};


var ambTempForCurrentDay = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length) {
            async.series({

                ambTemp: function (selfcb) {
                    var matchObj = {
                        //                        _dt: {
                        //                                $gte: requestObject.dateRange.from,
                        //                                $lte: requestObject.dateRange.to
                        //                            },
                        //                            deviceTypeId: "WSTATION1"
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        },
                        deviceTypeId: devconfig.ws.MANG
                    }

                    if (requestObject.sites) {
                        matchObj.site = requestObject.sites.toString()
                    }

                    //                    if(requestObject.zones){
                    //                        matchObj.zone =  requestObject.zones.toString()
                    //                    }

                    //                    if(requestObject.deviceSn){
                    //                        matchObj.deviceSn =  requestObject.deviceSn.toString()
                    //                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_h"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_d"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_mo"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_y"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_dt"
                            },
                            AmbTmpC: {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    console.log('Group id', group_id);

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                AmbTmpC: "$AmbTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'AmbTmpC': '$AmbTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('wstation_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {

                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }
            }, function (err, data) {

                cb(err, data)
            })
        } else {
            async.series({
                ambTemp: function (selfcb) {

                    var matchObj = {
                        ts: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }
                        //                        deviceSn : {$nin : ["35317", "37305", "37399", "37308", "37327", "37401", "37304", "37317"]}
                    }

                    if (requestObject.sites) {
                        //                        matchObj.site =  requestObject.sites.toString()
                        matchObj.site = requestObject.sites
                    }

                    if (requestObject.deviceSn) {
                        matchObj.deviceSn = requestObject.deviceSn.toString()
                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_h"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_d"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }


                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mo"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_y"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mi"
                            },
                            "AmbTmpC": {
                                "$avg": "$AmbTmpC"
                            }
                        }
                    }

                    console.log(group_id);

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                AmbTmpC: "$AmbTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'AmbTmpC': '$AmbTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('message_history', criteria, function (err, docs) {
                        if (!err && docs && docs.length) {

                            //console.log(docs)
                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }

            }, function (err, data) {
                cb(err, data)
            })
        }
    });
};


var windSpeedForCurrentDay = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length) {
            async.series({

                ambTemp: function (selfcb) {
                    var matchObj = {
                        //                        _dt: {
                        //                                $gte: requestObject.dateRange.from,
                        //                                $lte: requestObject.dateRange.to
                        //                            },
                        //                            deviceTypeId: "WSTATION1"
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        },
                        deviceTypeId: devconfig.ws.MANG
                    }

                    if (requestObject.sites) {
                        matchObj.site = requestObject.sites.toString()
                    }

                    //                    if(requestObject.zones){
                    //                        matchObj.zone =  requestObject.zones.toString()
                    //                    }

                    //                    if(requestObject.deviceSn){
                    //                        matchObj.deviceSn =  requestObject.deviceSn.toString()
                    //                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_h"
                            },
                            AmbTmpC: {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_d"
                            },
                            AmbTmpC: {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_mo"
                            },
                            AmbTmpC: {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_y"
                            },
                            AmbTmpC: {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_dt"
                            },
                            AmbTmpC: {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    console.log('Group id', group_id);

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                AmbTmpC: "$AmbTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'WindSpeed': '$AmbTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('wstation_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {

                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }
            }, function (err, data) {

                cb(err, data)
            })
        } else {
            async.series({
                ambTemp: function (selfcb) {

                    var matchObj = {
                        ts: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }
                        //                        deviceSn : {$nin : ["35317", "37305", "37399", "37308", "37327", "37401", "37304", "37317"]}
                    }

                    if (requestObject.sites) {
                        //                        matchObj.site =  requestObject.sites.toString()
                        matchObj.site = requestObject.sites
                    }

                    if (requestObject.deviceSn) {
                        matchObj.deviceSn = requestObject.deviceSn.toString()
                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_h"
                            },
                            "AmbTmpC": {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_d"
                            },
                            "AmbTmpC": {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }


                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mo"
                            },
                            "AmbTmpC": {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_y"
                            },
                            "AmbTmpC": {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mi"
                            },
                            "AmbTmpC": {
                                "$avg": "$WindSpeed"
                            }
                        }
                    }

                    console.log(group_id);

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                AmbTmpC: "$AmbTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'WindSpeed': '$AmbTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('message_history', criteria, function (err, docs) {
                        if (!err && docs && docs.length) {

                            //console.log(docs)
                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }

            }, function (err, data) {
                cb(err, data)
            })
        }
    });
};


var poaForCurrentDay = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length) {
            async.series({

                poa: function (selfcb) {
                    var matchObj = {
                        //                        _dt: {
                        //                                $gte: requestObject.dateRange.from,
                        //                                $lte: requestObject.dateRange.to
                        //                            },
                        //                            deviceTypeId: "WSTATION1"
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        },
                        deviceTypeId: devconfig.ws.MANG
                    }

                    if (requestObject.sites) {
                        //                        matchObj.site =  requestObject.sites.toString()
                        //                        matchObj.site =  requestObject.sites
                    }

                    //                    if(requestObject.zones){
                    //                        matchObj.zone =  requestObject.zones.toString()
                    //                    }

                    //                    if(requestObject.deviceSn){
                    //                        matchObj.deviceSn =  requestObject.deviceSn.toString()
                    //                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_h"
                            },
                            AmbTmpC: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_d"
                            },
                            AmbTmpC: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_mo"
                            },
                            AmbTmpC: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_y"
                            },
                            AmbTmpC: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceTypeId",
                                ts: "$_dt"
                            },
                            AmbTmpC: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                AmbTmpC: "$AmbTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'POA': '$AmbTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('wstation_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {

                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }
            }, function (err, data) {

                cb(err, data)
            })
        } else {
            async.series({
                poa: function (selfcb) {

                    var matchObj = {
                        ts: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }
                        //                        deviceSn : {$nin : ["35317", "37305", "37399", "37308", "37327", "37401", "37304", "37317"]}
                    }

                    if (requestObject.sites) {
                        //                        matchObj.site =  requestObject.sites.toString()
                        matchObj.site = requestObject.sites
                    }

                    if (requestObject.deviceSn) {
                        matchObj.deviceSn = requestObject.deviceSn.toString()
                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_h"
                            },
                            "AmbTmpC": {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_d"
                            },
                            "AmbTmpC": {
                                "$avg": "$POA"
                            }
                        }
                    }


                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mo"
                            },
                            "AmbTmpC": {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_y"
                            },
                            "AmbTmpC": {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceSn",
                                ts: "$_mi"
                            },
                            "AmbTmpC": {
                                "$avg": "$POA"
                            }
                        }
                    }

                    console.log(group_id);

                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },

                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                site: "$_id.site",
                                deviceId: "$_id.deviceId",
                                AmbTmpC: "$AmbTmpC"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site",
                                    deviceId: "$deviceId"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'POA': '$AmbTmpC'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                site: '$_id.site',
                                deviceSn: '$_id.deviceId',
                                values: '$data'
                            }
                        }
                    ]

                    db.aggregate('message_history', criteria, function (err, docs) {
                        if (!err && docs && docs.length) {

                            //console.log(docs)
                        } else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                }

            }, function (err, data) {
                cb(err, data)
            })
        }
    });
};


var parameters = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        }
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length > 0) {
            console.log('Devices List', devices);
            var criteria = {
                condition: {},
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                }
            };
            if (requestObject.dateRange) {
                criteria.condition._dt = {
                    "$gte": requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }
            if (requestObject.deviceSn) {
                criteria.condition.deviceTypeId = requestObject.deviceSn
            }

            console.log('Criteria', criteria);

            criteria.requiredFields = {
                "invEnergyTotal": 1,
                "invActivePower": 1,
                "invEnergyToday": 1,
                "invPhaseA_RealPower": 1,
                "invPhaseB_RealPower": 1,
                "invPhaseC_RealPower": 1,
                "invPV1_Voltage": 1,
                "invPV1_Current": 1,
                "invPV1_Power": 1,
                "invPV2_Voltage": 1,
                "invPV2_Current": 1,
                "invPV2_Power": 1,
                "invApparentPower": 1,
                "invReactivePower": 1,
                "invPhaseA_Voltage": 1,
                "invPhaseB_Voltage": 1,
                "invPhaseC_Voltage": 1,
                "invPhaseA_Current": 1,
                "invPhaseB_Current": 1,
                "invPhaseC_Current": 1,
                "invPhaseA_Frequency": 1,
                "invPhaseB_Frequency": 1,
                "invPhaseC_Frequency": 1,
                "invPower_Board": 1,
                "invHeat_Sink1": 1,
                "invHeat_Sink2": 1,
                "invHeat_Sink3": 1,
                _id: 0
            };

            db.find('inv_formatted_logs', criteria, function (err, docs) {
                cb(err, docs[0]);
            });
        } else {
            var criteria = {
                condition: {
                    site: requestObject.sites
                },
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                }
            };

            //            if (!_.isEmpty(requestObject.customerId)) {
            //                criteria.condition.customer = requestObject.customerId
            //            }

            if (requestObject.dateRange) {
                criteria.condition._dt = {
                    "$gte": requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }
            if (requestObject.deviceSn) {
                criteria.condition.deviceSn = requestObject.deviceSn
            }

            criteria.requiredFields = {
                "invEnergyTotal": 1,
                "invActivePower": 1,
                "invPhaseA_Current": 1,
                "invPhaseB_Current": 1,
                "invPhaseC_Current": 1,
                "invPhaseA_RealPower": 1,
                "invPhaseB_RealPower": 1,
                "invPhaseC_RealPower": 1,
                "invPowerFactor": 1,
                "invApparentPower": 1,
                "invReactivePower": 1,
                "invPhaseA_Voltage": 1,
                "invPhaseB_Voltage": 1,
                "invPhaseC_Voltage": 1,
                "invGrid_Frequency": 1,
                "invPV1_Voltage": 1,
                "invPV2_Voltage": 1,
                "invPV1_Current": 1,
                "invPV2_Current": 1,
                "invPV1_Power": 1,
                "invPV2_Power": 1,
                _id: 0
            }

            db.find('message_history', criteria, function (err, docs) {
                cb(err, docs[0]);
            });
        }
    });
}


var ws = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        }
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length > 0) {
            var criteria = {
                condition: {},
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                }
            };
            if (requestObject.dateRange) {
                criteria.condition._dt = {
                    "$gte": requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }
            if (requestObject.deviceSn) {
                criteria.condition.deviceTypeId = requestObject.deviceSn
            }

            criteria.requiredFields = {
                "WindSpeed": 1,
                "WindDirection": 1,
                "AmbTmpC": 1,
                "Humidity": 1,
                "POA-Energy": 1,
                _id: 0
            };

            db.find('wstation_formatted_logs', criteria, function (err, docs) {
                cb(err, docs[0]);
            });
        } else {
            var criteria = {
                condition: {
                    site: requestObject.sites
                },
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                }
            };

            if (requestObject.deviceSn) {
                criteria.condition.deviceSn = requestObject.deviceSn;
            }

            criteria.requiredFields = {
                "WindSpeed": 1,
                "AmbTmpC": 1,
                "POA-Energy": 1,
                _id: 0
            }

            db.find('message_history', criteria, function (err, docs) {
                cb(err, docs[0]);
            });
        }
    });
}

var wsamb = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        }
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length > 0) {
            console.log('Devices List', devices);
            var criteria = {
                //                condition: {
                //                        "deviceTypeId": "WSTATION1"
                //                    },
                //                    sort: {
                //                        _id: -1
                //                    },
                //                    pagination: {
                //                        limit: 1
                //                    }
                condition: {
                    "deviceTypeId": devconfig.ws.MANG
                },
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                }
            };

            //            if (requestObject.deviceSn) {
            //                criteria.condition.deviceTypeId = requestObject.deviceSn
            //            }

            if (requestObject.dateRange) {
                criteria.condition._dt = {
                    "$gte": requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }

            console.log('Criteria', criteria);

            criteria.requiredFields = {
                "AmbTmpC": 1,
                _id: 0
            };

            db.find('wstation_formatted_logs', criteria, function (err, docs) {
                cb(err, docs[0]);
            });
        } else {
            var criteria = {
                condition: {
                    site: requestObject.sites
                },
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                }
            };

            if (requestObject.deviceSn) {
                criteria.condition.deviceSn = requestObject.deviceSn;
            }

            if (requestObject.dateRange) {
                criteria.condition._dt = {
                    "$gte": requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }

            criteria.requiredFields = {
                "AmbTmpC": 1,
                _id: 0
            }

            db.find('message_history', criteria, function (err, docs) {
                cb(err, docs[0]);
            });
        }
    });
}

var gparameters = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        }
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length > 0) {
            console.log('Devices List', devices);
            var criteria = {
                condition: {},
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                }
            };

            if (requestObject.deviceSn) {
                criteria.condition.deviceTypeId = requestObject.deviceSn
            }

            console.log('Criteria', criteria);

            criteria.requiredFields = {
                "gridApparentPower": 1,
                "gridActivePower": 1,
                "gridReactivePower": 1,
                "gridPowerFactor": 1,
                "gridPNVoltage": 1,
                "gridVoltage": 1,
                "gridCurrent": 1,
                "gridFrequency": 1,
                "gridPhase1_ApparentPower": 1,
                "gridPhase1_ActivePower": 1,
                "gridPhase1_ReactivePower": 1,
                "gridPhase1_PF": 1,
                "gridPhase1_Voltage": 1,
                "gridPhase1_PNVoltage": 1,
                "gridPhase1_Current": 1,
                "gridPhase2_ApparentPower": 1,
                "gridPhase2_ActivePower": 1,
                "gridPhase2_ReactivePower": 1,
                "gridPhase2_PF": 1,
                "gridPhase2_Voltage": 1,
                "gridPhase2_PNVoltage": 1,
                "gridPhase2_Current": 1,
                "gridPhase3_ApparentPower": 1,
                "gridPhase3_ActivePower": 1,
                "gridPhase3_ReactivePower": 1,
                "gridPhase3_PF": 1,
                "gridPhase3_Voltage": 1,
                "gridPhase3_PNVoltage": 1,
                "gridPhase3_Current": 1,
                "gridEnergyTotal": 1,
                "_id": 0
            };

            db.find('grid_formatted_logs', criteria, function (err, docs) {

                /*docs[0].gridPhase1_PF = docs[0].gridPowerFactor ? docs[0].gridPowerFactor : 0
                docs[0].gridPhase2_PF = docs[0].gridPowerFactor ? docs[0].gridPowerFactor : 0
                docs[0].gridPhase3_PF = docs[0].gridPowerFactor ? docs[0].gridPowerFactor : 0*/
                cb(err, docs[0]);
            });
        }
    });
}


var gmeterCommunicationStatus = function (requestObject, cb) {

    var criteria = {
        condition: {
            "typeName": {
                $in: ["GMETER"]
            }
        },
        sort: {},
        pagination: {}
    };

    if (!_.isEmpty(requestObject.sites)) {
        criteria.condition.site = requestObject.sites
    }

    if (!_.isEmpty(requestObject.zones)) {
        criteria.condition.zone = requestObject.zones
    }

    if (!_.isEmpty(requestObject.deviceSn)) {
        criteria.condition.name = requestObject.deviceSn
    }


    db.find('devices', criteria, function (err, devices) {
        if (!err && devices && devices.length > 0) {

            var devicesIterator = function (device, deviceIteratorCB) {
                async.parallel({

                    lastReportedTime: function (selfcb) {
                        var criteria = {
                            condition: {
                                parameter: 'gridEnergyTotal',
                                "device": device._id
                            },
                            sort: {
                                _id: -1
                            },
                            pagination: {
                                limit: 1
                            },
                            requiredFields: {
                                lastReportedTime: 1,
                                _id: 0,
                                deviceSn: 1
                            }
                        }

                        db.find('days', criteria, function (e, docs) {
                            if (!err && docs && docs.length) {} else {}
                            selfcb(err, docs);
                        });
                    },
                    alarmCount: function (selfcb) {

                        var criteria = {
                            condition: {
                                "device": device._id,
                                "clearedStatus": "NOT_CLEARED"
                            },
                            sort: {},
                            pagination: {},
                            requiredFields: {}
                        }

                        db.count('alarm_history', criteria, function (e, docs) {
                            if (!err && docs && docs.length) {} else {
                                console.log(err)
                            }
                            selfcb(err, docs);
                        });
                    }

                }, function (err, dataObj) {
                    _.extend(device, dataObj);
                    deviceIteratorCB(null)
                })
            }

            async.each(devices || [], devicesIterator, function (err) {

                cb(null, devices);
            });

        } else {
            cb(null, null)
        }
    });
}


var gmeterenergyYield = function (requestObject, cb) {
    async.series({
        energyYield: function (cb) {
            var matchObj = {
                parameter: 'gridEnergyTotal',
                ts: {
                    "$gte": requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }

            if (!_.isEmpty(requestObject.sites)) {
                matchObj.site = requestObject.sites
            }

            if (!_.isEmpty(requestObject.zones)) {
                matchObj.zone = requestObject.zones
            }

            if (!_.isEmpty(requestObject.deviceSn)) {
                matchObj.deviceSn = requestObject.deviceSn
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        ts: 1,
                        deviceId: 1,
                        deviceSn: 1,
                        site: 1,
                        zone: 1,
                        gateway: 1,
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            zone: "$zone",
                            deviceSn: "$deviceSn"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                },
                {
                    $sort: {
                        deviceSn: 1
                    }
                }
            ];

            db.aggregate('days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {} else {
                    console.log(err)
                }
                cb(err, docs);
            });
        }
    }, function (err, data) {
        cb(err, data)
    })
};


var wsDailyWhm2 = function (requestObject, cb) {

    //    console.log("requestObject..........oj.........", requestObject)
    var deviceCriteria = {
        condition: {
            site: requestObject.sites,
            typeName: 'GMETER'
        }
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length > 0) {
            var matchObj = {
                "_id.site": requestObject.sites,
                "_id.ts": {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            }

            var criteria = [
                {
                    $match: matchObj
                },
                {
                    $project: {
                        "orientation": 1,
                        "poa": 1
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$_id.site",
                            orientation: "$orientation"
                        },
                        totalPoa: {
                            $sum: '$poa'
                        }
                    }
                }
            ];

            console.log('Poa:' + JSON.stringify(criteria));
            db.aggregate('poaGeneration', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {
                    console.log('Poa:' + JSON.stringify(docs));
                } else {
                    console.log(err)
                }
                cb(err, docs);

            });
        } else {
            var criteria = {
                condition: {
                    site: requestObject.sites
                },
                sort: {
                    _id: -1
                },
                pagination: {
                    limit: 1
                }
            };

            if (requestObject.deviceSn) {
                criteria.condition.deviceSn = requestObject.deviceSn;
            }

            criteria.requiredFields = {
                "WindSpeed": 1,
                "AmbTmpC": 1,
                "POA-Energy": 1,
                _id: 0
            }

            db.find('message_history', criteria, function (err, docs) {
                cb(err, docs[0]);
            });
        }
    });
}



var WindDirectionSpeedTrend = function(requestObject, cb){

   // console.log("REQ OBJ : ",requestObject)

    try{
        async.series({
            windTrend : function(selfcb) {
                var matchObj = {
                    _dt : {$gte : requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                }

                if(requestObject.sites){
                    matchObj.site =  requestObject.sites
                }


                if(requestObject.zones && requestObject.zones.length > 0){
                    matchObj.zone =  requestObject.zones
                }

                if (requestObject.deviceSn) {
                    matchObj.deviceTypeId = requestObject.deviceSn
                }

                var group_id = {};

                if(requestObject.groupBy == 'hours') {
                    group_id = { _id: {site :"$site",zone:"$zone",deviceId:"$deviceTypeId", ts:"$_h"}, windSpeed : { "$avg" : "$ws001.value"},windDirection : { "$avg" : "$ws002.value"}  }
                }

                if(requestObject.groupBy == 'days') {
                    group_id = { _id: {site :"$site",zone:"$zone",deviceId:"$deviceTypeId",ts:"$_d"}, windSpeed : { "$avg" : "$ws001.value"},windDirection : { "$avg" : "$ws002.value"}  }
                }

                if(requestObject.groupBy == 'months') {
                    group_id = { _id: {site :"$site",zone:"$zone",deviceId:"$deviceTypeId",ts:"$_mo"}, windSpeed : { "$avg" : "$ws001.value"},windDirection : { "$avg" : "$ws002.value"}  }
                }

                if(requestObject.groupBy == 'years') {
                    group_id = { _id: {site :"$site",zone:"$zone",deviceId:"$deviceTypeId",ts:"$_y"}, windSpeed : { "$avg" : "$ws001.value"},windDirection : { "$avg" : "$ws002.value"} }
                }

                if(requestObject.groupBy == 'live') {
                    group_id = { _id: {site :"$site",zone:"$zone",deviceId:"$deviceTypeId",ts:"$_dt"}, windSpeed : { "$avg" : "$ws001.value"},windDirection : { "$avg" : "$ws002.value"}  }
                }

                var criteria = [
                    { $match: matchObj},
                    { $group: group_id},

                    { $project:
                    {   _id: 0,
                        ts: "$_id.ts",
                        deviceId: "$_id.deviceId",
                        windSpeed: "$windSpeed",
                        windDirection: "$windDirection"
                    }
                    },
                    { $sort: { "ts": 1 } },
                    { $group: { _id: {deviceId:"$deviceId"}, data : { "$push" : {ts : '$ts', 'windSpeed' : '$windSpeed' ,'windDirection': "$windDirection"}}  } },
                    { $project: {_id:0, deviceSn : '$_id.deviceId', values : '$data'}}
                ]


                db.aggregate('periodic_wstation_logs', criteria, function(err, docs){

                    console.log(docs)
                    if(!err && docs && docs.length){

                    }else{

                        console.log(err)
                    }
                    selfcb(err, docs );

                });
            }

        },function(err,data){

            cb(err, data)
        })
    }catch(e){
        console.log(e)
    }
}





module.exports = {
    eTotal: eTotal,
    POA: POA,
    Alarms: Alarms,
    gAlarms: gAlarms,
    alarmList: alarmList,
    alarmCount: alarmCount,
    updateAlarms: updateAlarms,
    invCommunicationStatus: invCommunicationStatus,
    activePowerForCurrentDay: activePowerForCurrentDay,
    modTempForCurrentDay: modTempForCurrentDay,
    ambTempForCurrentDay: ambTempForCurrentDay,
    windSpeedForCurrentDay: windSpeedForCurrentDay,
    poaForCurrentDay: poaForCurrentDay,
    energyYield: energyYield,
    prs: prs,
    ws: ws,
    modTempVSAmpTempForSite: modTempVSAmpTempForSite,
    wsamb: wsamb,
    parameters: parameters,
    gmeterCommunicationStatus: gmeterCommunicationStatus,
    gmeterenergyYield: gmeterenergyYield,
    gparameters: gparameters,
    wsDailyWhm2: wsDailyWhm2,
    editAlarms: editAlarms,
    WindDirectionSpeedTrend : WindDirectionSpeedTrend
}