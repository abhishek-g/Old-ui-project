/**
 * Created by harinaths on 19/8/14.
 */

var _ = require('underscore');
var async = require('async');
var db = global.db;
var ObjectId = db.ObjectId;
var moment = require('moment');

var validateSiteName = function (requestObject, cb) {

    var criteria = {
        condition: {},
        sort: {},
        pagination: {
            skip: 0,
            limit: 10
        },
        requiredFields: {}
    }

    if (!requestObject.name) {
        cb("INVALID_NAME", null);
        return;
    } //TERMINATION POINT

    criteria.condition.name = requestObject.name;
    criteria.condition.customer = requestObject.customer;

    //    console.log("SITES VALIDATION CRITERIA ", criteria.condition)

    db.findOne('sites', criteria, function (err, site) {
        if (!err && site) {
            cb("ALREADY_EXIST", null)
        } else {
            cb(null, "VALID");
        }
    });

};

/*Create Site*/
var create = function (requestObject, cb) {
    //    console.log("inside sites-service.js : create")
    if (requestObject) {
        var obj = {
            name: requestObject.name,
            customer: requestObject.customerId,
            accessKey: requestObject.accessKey,
            user: requestObject.user._id,
            meta: requestObject.meta,
            location: requestObject.location
        };
        //        console.log("inside sites-service.js : obj",obj)
        db.save('sites', obj, //cb)
            function (err, data) {
                //            console.log('iterating done in site-service create()',err,data);
                cb(null, data);
            }); //cb(getObjId(obj,cb)));
    } else {
        cb("FAILED", null)
    }
}

//var getObjId = function(objparam,cb){
//    var objId = objparam.get( "_id" );
//    cb(objId);
//}

var edit = function (requestObject, cb) {

    if (requestObject && requestObject.siteId) {
        var obj = {};
        requestObject.name && (obj.name = requestObject.name);
        requestObject.meta && (obj.meta = requestObject.meta);
        requestObject.location && (obj.location = requestObject.location);


        var updateObj = {
            condition: {
                _id: requestObject.siteId
            },
            value: {
                $set: obj
            },
            options: {
                multi: false,
                upsert: false
            }
        };


        db.update('sites', updateObj, cb);
    } else {
        cb("INVALID_SITE_ID", null)
    }
}


var disable = function (requestObject, cb) {

    if (requestObject && requestObject.siteId) {
        var obj = {
            disabled: true,
            disabledBy: requestObject.user._id
        };

        var updateObj = {
            condition: {
                _id: requestObject.siteId
            },
            value: {
                $set: obj
            },
            options: {
                multi: false,
                upsert: false
            }
        };

        db.update('sites', updateObj, cb);
    } else {
        cb("INVALID_SITE_ID", null)
    }
}

var list = function (requestObject, cb) {

    var criteria = {
        condition: {},
        sort: {},
        pagination: {},
        requiredFields: {}
    };


    /* DeviceGateway based Devices*/

    if (!_.isEmpty(requestObject.customerId)) {
        criteria.condition.customer = requestObject.customerId
    }

    /* Paginated Records */

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

    //    console.log("PAGINATION Request Object : ", requestObject.pagination);
    //    console.log("PAGINATION : ", criteria.pagination);

    /* DB Query*/
    db.find('sites', criteria, cb);
};

var count = function (requestObject, cb) {

    var criteria = {
        condition: {},
        sort: {},
        pagination: {},
        requiredFields: {}
    };


    /* DeviceGateway based Devices*/

    if (!_.isEmpty(requestObject.customerId)) {
        criteria.condition.customer = requestObject.customerId
    }

    /* DB Query*/
    db.count('sites', criteria, cb);
};


var mapred = function (requestObject, cb) {

    var criteria = {
        map: function () {
            //            db.find('sites');
            emit({
                day: 1
            }, {
                count: 10
            });
        },
        reduce: function (key, values) {
            var count = 0;

            values.forEach(function (v) {
                count += v['count'];
            });

            return {
                count: count
            };
        },
        options: {
            out: "roles"
                //      query: <document>,
                //      sort: <document>,
                //     limit: <number>,
                //     finalize: <function>,
                //      scope: <document>,
                //      jsMode: <boolean>,
                //      verbose: <boolean>
        }
    }

    /* DB Query*/
    db.mapReduce('sites', criteria, cb)
};


var listIdText = function (requestObject, cb) {

    var criteria = {
        condition: {},
        sort: {},
        pagination: {},
        requiredFields: {
            id: 1,
            name: 1
        }
    };

    /* List roles created by logged in user*/

    if (!_.isEmpty(requestObject.customerId)) {
        //        console.log("user._id ",requestObject.user._id )
        criteria.condition.user = requestObject.user._id;
    }

    criteria.condition.disabled = {
        $ne: true
    }

    if (!_.isEmpty(requestObject.sort)) {
        criteria.sort = requestObject.sort
    }

    /* DB Query*/
    db.find('sites', criteria, cb);
};


var allstatus = function (requestObject, cb) {

    var criteria = {
        condition: {},
        sort: {},
        pagination: {},
        requiredFields: {}
    };


    /* DeviceGateway based Devices*/

    if (!_.isEmpty(requestObject.customerId)) {
        criteria.condition.customer = requestObject.customerId
    }

    /* DB Query*/
    db.find('sites', criteria, function (err, sites) {

        async.each(sites || [], function (site, sitesIteratorCB) {
            async.series({
                eneryYield: function (selfcb) {
                    var matchObj = {
                        parameter: 'E-Total',
                        "deviceId": {
                            $in: ['WRTP4Q75', 'WRTP4Q8C']
                        },
                        ts: {
                            $gte: moment(requestObject.date).startOf('day')._d,
                            $lte: moment(requestObject.date).endOf('day')._d
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
                                yield: {
                                    $subtract: ['$end', '$min']
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site"
                                },
                                yield: {
                                    $sum: '$yield'
                                }
                            }
                        }
                    ];

                    db.aggregate('days', criteria, function (e, docs) {

                        if (!err && docs && docs.length > 0) {
                            console.log(docs)
                            site["todayyield"] = docs[0]["yield"]
                        } else {
                            site["todayyield"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });
                },
                irradiance: function (selfcb) { //IntSolIrr
                    var matchObj = {
                        parameter: 'IntSolIrr',
                        "deviceId": {
                            $in: ['SENS0802']
                        },
                        ts: {
                            $gte: moment(requestObject.date).startOf('day')._d,
                            $lte: moment(requestObject.date).endOf('day')._d
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
                            $group: {
                                _id: {
                                    site: "$site"
                                },
                                irradiance: {
                                    $sum: '$current'
                                }
                            }
                        }
                    ];

                    db.aggregate('days', criteria, function (e, docs) {

                        if (!err && docs && docs.length > 0) {
                            console.log(docs)
                            site["irradiance"] = docs[0]["irradiance"] || 0
                        } else {
                            site["irradiance"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });
                },
                isolation: function (selfcb) {
                    var matchObj = {
                        parameter: 'IntSolIrr wh',
                        "deviceId": {
                            $in: ['SENS0802']
                        },
                        ts: {
                            $gte: moment(requestObject.date).startOf('day')._d,
                            $lte: moment(requestObject.date).endOf('day')._d
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
                                yield: {
                                    $subtract: ['$end', '$start']
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site"
                                },
                                yield: {
                                    $sum: '$yield'
                                }
                            }
                        }
                    ];

                    db.aggregate('days', criteria, function (e, docs) {

                        if (!err && docs && docs.length > 0) {
                            console.log(docs)
                            site["IntSolIrrwh"] = docs[0]["yield"] || 0
                        } else {
                            site["IntSolIrrwh"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });
                },
                currentGeneration: function (selfcb) {
                    var matchObj = {
                        parameter: 'Pac',
                        "deviceId": {
                            $in: ['WRTP4Q75', 'WRTP4Q8C']
                        },
                        ts: {
                            $gte: moment(requestObject.date).startOf('day')._d,
                            $lte: moment(requestObject.date).endOf('day')._d
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
                            $group: {
                                _id: {
                                    site: "$site"
                                },
                                Pac: {
                                    $sum: '$current'
                                }
                            }
                        }
                    ];

                    db.aggregate('days', criteria, function (e, docs) {

                        if (!err && docs && docs.length) {
                            site["Pac"] = docs[0]["Pac"]
                        } else {
                            site["Pac"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });
                },
                totalEnergyYield: function (selfcb) {

                    var matchObj = {
                        parameter: 'E-Total',
                        "deviceId": {
                            $in: ['WRTP4Q75', 'WRTP4Q8C']
                        },
                        ts: {
                            $gte: moment(requestObject.date).startOf('year')._d,
                            $lte: moment(requestObject.date).endOf('year')._d
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
                                yield: {
                                    $subtract: ['$end', '$start']
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    site: "$site"
                                },
                                yield: {
                                    $sum: '$yield'
                                }
                            }
                        }
                    ];

                    db.aggregate('years', criteria, function (e, docs) {

                        if (!err && docs && docs.length) {
                            site["totalYield"] = docs[0]["yield"]
                        } else {
                            site["totalYield"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });
                },
                weather: function (selfcb) {

                    var matchObj = {
                        parameter: 'TmpAmb C',
                        "deviceId": {
                            $in: ['SENS0802']
                        },
                        ts: {
                            $gte: moment(requestObject.date).startOf('day')._d,
                            $lte: moment(requestObject.date).endOf('day')._d
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
                            $group: {
                                _id: {
                                    site: "$site"
                                },
                                weather: {
                                    $avg: '$current'
                                }
                            }
                        }
                    ];

                    db.aggregate('days', criteria, function (e, docs) {

                        if (!err && docs && docs.length) {
                            site["weather"] = docs[0]["weather"]
                        } else {
                            site["weather"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });


                }
            }, function (err, status) {
                sitesIteratorCB(null);
            })
        }, function (err) {

            cb(null, sites);

        });


    });

};

var status = function (requestObject, cb) {

    var criteria = {
        condition: {},
        sort: {},
        pagination: {},
        requiredFields: {}
    };

    if (!_.isEmpty(requestObject.customerId)) {
        criteria.condition.customer = requestObject.customerId
    }

    /* DB Query*/
    db.find('sites', criteria, function (err, sites) {
        async.series({
            energyYield: function (selfcb) {
                var matchObj = {
                    "_id.site": {
                        $in: requestObject.sites
                    },
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
                            "yield": 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                site: "$_id.site"
                            },
                            yield: {
                                $sum: '$yield'
                            }
                        }
                    }
                    ];

                console.log(criteria);

                db.aggregate('energyGeneration', criteria, function (err, docs) {
                    if (!err && docs && docs.length > 0) {
                        console.log('Energy Generation:' + JSON.stringify(docs));
                    } else {
                        console.log(err)
                    }
                    selfcb(err, docs);
                });
            },
            poa: function (selfcb) {
                var matchObj = {
                    "_id.site": {
                        $in: requestObject.sites
                    },
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
                            "capacity.value": 1,
                            "orientation": 1,
                            "energyGenreation": 1,
                            "poa": 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                site: "$_id.site",
                                orientation: "$orientation"
                            },
                            totalCap: {
                                $sum: '$capacity.value'
                            },
                            totalEnergy: {
                                $sum: '$energyGeneration'
                            },
                            totalPoa: {
                                $sum: '$poa'
                            }
                        }
                    }
                    ];

                db.aggregate('poaGeneration', criteria, function (err, docs) {

                    if (!err && docs && docs.length > 0) {
                        console.log('Poa:' + JSON.stringify(docs));
                    } else {
                        console.log(err)
                    }
                    selfcb(err, docs);
                });


            },
            currentGeneration: function (selfcb) {
                var matchObj = {
                    "_id.site": {
                        $in: requestObject.sites
                    },
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
                            "activePower": 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                site: "$_id.site"
                            },
                            activePower: {
                                $sum: '$activePower'
                            }
                        }
                    }
                    ];

                console.log(criteria);

                db.aggregate('activePowerGeneration', criteria, function (err, docs) {

                    if (!err && docs && docs.length > 0) {
                        console.log('Active Power Generation:' + JSON.stringify(docs));
                    } else {
                        console.log(err)
                    }
                    selfcb(err, docs);
                });
            },

            totalGen: function (selfcb) {
                var matchObj = {
                    "_id.site": {
                        $in: requestObject.sites
                    }
                }

                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $project: {
                            yield: 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                site: "$_id.site"
                            },
                            yield: {
                                $sum: '$yield'
                            }
                        }
                    }
                    ];

                db.aggregate('energyGeneration', criteria, function (err, docs) {
                    selfcb(err, docs);
                });
            },

            weather: function (selfcb) {

                var matchObj = {
                    "site": {
                        $in: requestObject.sites
                    },
                    parameter: 'AmbTmpC',
                    "deviceId": {
                        $in: ['SENS0802']
                    },
                    ts: {
                        $gte: moment(requestObject.date).startOf('day')._d,
                        $lte: moment(requestObject.date).endOf('day')._d
                    }
                }

                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $group: {
                            _id: {
                                site: "$site"
                            },
                            weather: {
                                $avg: '$current'
                            }
                        }
                    }
                    ];

                db.aggregate('days', criteria, function (e, docs) {

                    if (!err && docs && docs.length) {} else {
                        console.log(err)
                    }
                    selfcb(err, docs);
                });
            },

            lastReportedTime: function (selfcb) {

                var matchObj = {
                    "site": {
                        $in: requestObject.sites
                    },
                    parameter: 'invEnergyTotal'
                }

                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $project: {
                            "lastReportedTime": 1,
                            'site': 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                site: "$site"
                            },
                            lastReportedTime: {
                                $max: "$lastReportedTime"
                            }
                        }
                    }
                    ];

                db.aggregate('years', criteria, function (e, docs) {

                    if (!err && docs && docs.length) {} else {
                        console.log(err)
                    }
                    selfcb(err, docs);
                });
            },

            alarmCount: function (selfcb) {
                var matchObj = {
                    "site": {
                        $in: requestObject.sites
                    },
                    // "ts" : {$gte : requestObject.dateRange.from , $lte : requestObject.dateRange.to},
                    "clearedStatus": "NOT_CLEARED"
                }

                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $group: {
                            _id: {
                                site: "$site"
                            },
                            alarmcount: {
                                $sum: 1
                            }
                        }
                    }
                    ];


                db.aggregate('alarm_history', criteria, function (e, docs) {
                    if (!err && docs && docs.length) {} else {
                        console.log(err)
                    }
                    selfcb(err, docs);
                });
            },
            peakPower: function (selfcb) {

                var peakPower = 0;
                var matchObj = {

                    "_dt": {
                        //                        $gte: moment(requestObject.date).startOf('day')._d,
                        //                        $lte: moment(requestObject.date).endOf('day')._d
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
                            "gridActivePower": 1,
                            "site": 1,
                            "zone": 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                site: "$site",
                                zone: "$zone"
                            },
                            data: {
                                $max: '$gridActivePower'

                            }
                        }
                    }

                ];

                db.aggregate('grid_formatted_logs', criteria, function (err, docs) {

                    if (!err && docs && docs.length > 0) {

                        async.eachSeries(docs || [], function (data, dataCB) {
                            peakPower = data.data + peakPower
                            dataCB()
                        }, function (err, res) {
                            selfcb(err, peakPower)

                        })

                    } else {

                        console.log(err)
                        selfcb(err, 0)
                    }


                })
            }
        }, function (err, data) {
            console.log('Data from energy', JSON.stringify(data));
            cb(null, data);

        });
    });

};


var pr = function (requestObject, cb) {

    async.series({
        energyYield: function (selfcb) {
            var matchObj = {
                parameter: 'E-Total',
                "deviceId": {
                    $in: ['WRTP4Q75', 'WRTP4Q8C']
                },
                ts: {
                    $gte: moment().startOf('day')._d,
                    $lte: moment().endOf('day')._d
                }
            }
            if (requestObject.dateRange && requestObject.dateRange.from && requestObject.dateRange.to) {
                matchObj.ts = {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            } else {
                matchObj.ts = {
                    $gte: moment().startOf(requestObject.groupBy)._d,
                    $lte: moment().endOf(requestObject.groupBy)._d
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
                        yield: {
                            $subtract: ['$end', '$min']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            ts: "$ts"
                        },
                        yield: {
                            $sum: '$yield'
                        }
                    }
                },

                {
                    $sort: {
                        '_id.ts': 1
                    }
                },
                {
                    $project: {
                        ts: "$_id.ts",
                        site: "$_id.site",
                        yield: "$yield"
                    }
                }
            ];

            db.aggregate(requestObject.groupBy || 'days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {
                    console.log(docs);
                    console.log("%$#%$#%#$%$#%")

                } else {
                    console.log(err)
                }
                selfcb(err, docs);
            });
        },
        irradiance: function (selfcb) {
            var matchObj = {
                parameter: 'IntSolIrr wh',
                "deviceId": {
                    $in: ['SENS0802']
                },
                ts: {
                    $gte: moment().startOf('day')._d,
                    $lte: moment().endOf('day')._d
                }
            }
            if (requestObject.dateRange && requestObject.dateRange.from && requestObject.dateRange.to) {
                matchObj.ts = {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            } else {
                matchObj.ts = {
                    $gte: moment().startOf(requestObject.groupBy)._d,
                    $lte: moment().endOf(requestObject.groupBy)._d
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
                        yield: {
                            $subtract: ['$end', '$start']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            ts: "$ts"
                        },
                        yield: {
                            $sum: '$yield'
                        }
                    }
                },
                {
                    $project: {
                        ts: "$_id.ts",
                        site: "$_id.site",
                        yield: "$yield"
                    }
                },
                {
                    $sort: {
                        'ts': 1
                    }
                }
            ];

            db.aggregate(requestObject.groupBy || 'days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {
                    console.log("IRRADIANCE ", docs)

                } else {
                    console.log(err)
                }
                selfcb(err, docs);
            });
        }
    }, function (err, obj) {
        dataMerger(obj.energyYield, obj.irradiance, function (err, data) {
            console.log("data............................", data)
            cb(err, data);
        });

    })

};


var dataMerger = function (energyYield, irradiance, cb) {
    if (energyYield && irradiance && energyYield.length > 0 && irradiance.length > 0) {

        var index = 0;
        var data = {}
        async.eachSeries(energyYield || [], function (energy, energyIterator) {
            if (energy.ts.toString() == irradiance[index].ts.toString()) {
                data[energy.ts] = {
                    energyYield: energy.yield,
                    irradiance: irradiance[index].yield
                }
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


var energy = function (requestObject, cb) {

    async.series({
        energyYield: function (selfcb) {
            var matchObj = {

                parameter: 'E-Total',
                "deviceId": {
                    $in: ['WRTP4Q75', 'WRTP4Q8C']
                },
                ts: {
                    $gte: moment().startOf('day')._d,
                    $lte: moment().endOf('day')._d
                }
            }
            if (requestObject.dateRange && requestObject.dateRange.from && requestObject.dateRange.to) {
                matchObj.ts = {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            } else {
                matchObj.ts = {
                    $gte: moment().startOf(requestObject.groupBy)._d,
                    $lte: moment().endOf(requestObject.groupBy)._d
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
                        yield: {
                            $subtract: ['$end', '$min']
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            ts: "$ts"
                        },
                        yield: {
                            $sum: '$yield'
                        }
                    }
                },

                {
                    $sort: {
                        '_id.ts': 1
                    }
                },
                {
                    $project: {
                        ts: "$_id.ts",
                        site: "$_id.site",
                        yield: "$yield"
                    }
                }
            ];

            db.aggregate(requestObject.groupBy || 'days', criteria, function (err, docs) {
                selfcb(err, docs);
            });
        }

    }, function (err, data) {
        console.log("%#$%#$%FEFEGFBFBFHGFGEG")
        console.log(data)
        console.log("%#$%#$%FEFEGFBFBFHGFGEG")
        cb(err, data.energyYield)
    })

}


var weather = function (requestObject, cb) {
    var criteria = {
        condition: {},
        sort: {},
        pagination: {},
        requiredFields: {}
    };

    if (!_.isEmpty(requestObject.customerId)) {
        criteria.condition.customer = requestObject.customerId
    }

    //console.log("weather called......................")

    db.find('sites', criteria, function (err, sites) {
        var weatherData = [];
        var siteIterator = function (site, sitesIteratorCB) {

            if (site) {
                // console.log("Site Name : ",site.name);


                async.series({
                    sensorbox: function (selfCB) {
                        var sensorboxCriteria = {
                            condition: {
                                site: site._id,
                                typeName: 'Sensor Box'
                            },
                            requiredFields: {}
                        };

                        // console.log("test.......sensorboxCriteria..devices......",sensorboxCriteria)
                        db.find('devices', sensorboxCriteria, function (err, devices) {


                            if (devices && devices.length) {

                                async.each(devices || [], function (devices, devicesIteratorCB) {

                                    async.series({
                                        weather: function (selfcb) {
                                            var matchObj = {
                                                //"deviceId": "SENS0802",
                                                "device": devices._id,
                                                ts: {
                                                    $gte: moment().startOf('day')._d,
                                                    $lte: moment().endOf('day')._d
                                                }
                                            }

                                            var criteria = {
                                                condition: matchObj,
                                                sort: {
                                                    _id: -1
                                                },
                                                pagination: {
                                                    limit: 1
                                                }
                                            };

                                            db.find('message_history', criteria, function (err, docs) {

                                                if (docs && docs.length > 0) {

                                                    if (devices.meta.orientation != undefined) {
                                                        docs[0]["Orientiation"] = devices.meta.orientation
                                                            //console.log("message_history..11111111111....",devices.meta.orientation)
                                                    } else {
                                                        docs[0]["Orientiation"] = "Common";
                                                    }

                                                    selfcb(err, docs[0]);
                                                } else {
                                                    selfcb(err, {});
                                                }
                                            });
                                        }
                                    }, function (err, data) {

                                        //console.log("test.......1111111111111111111111111........",data)
                                        weatherData.push(data.weather);
                                        //                                    console.log(err, data);
                                        devicesIteratorCB(null);
                                    })


                                }, function (err) {
                                    selfCB(null);
                                });

                            } else {
                                selfCB(null);
                            }

                        })
                    },
                    wstation: function (selfCB) {
                        var wstationCriteria = {
                            //                            condition: {site: site._id, typeName: 'WSTATION'},
                            condition: {
                                site: site._id,
                                name: devconfig.ws.MANG
                            },
                            requiredFields: {}
                        };

                        db.find('devices', wstationCriteria, function (err, devices) {

                            // console.log("Node X....................", devices)
                            if (devices && devices.length > 0) {

                                console.log("IF DEVICES ... ")

                                async.each(devices || [], function (device, devicesIteratorCB) {

                                    async.series({
                                        weather: function (selfcb) {
                                            var matchObj = {

                                                "device": device._id.toString()
                                                    //ts: {$gte: moment().startOf('day')._d, $lte: moment().endOf('day')._d}
                                            }

                                            var criteria = {
                                                condition: matchObj,
                                                sort: {
                                                    _id: -1
                                                },
                                                pagination: {
                                                    limit: 1
                                                }
                                            };

                                            db.find('wstation_formatted_logs', criteria, function (err, docs) {
                                                if (devices.meta == undefined) {
                                                    docs[0]["Orientiation"] = "Common";
                                                    //console.log("message_history..11111111111....",docs)
                                                }
                                                if (docs && docs.length > 0) {
                                                    selfcb(err, docs[0]);
                                                } else {
                                                    selfcb(err, {});
                                                }
                                            });
                                        }
                                    }, function (err, data) {
                                        weatherData.push(data.weather);
                                        devicesIteratorCB(null);
                                    })


                                }, function (err) {
                                    selfCB(null);
                                });

                            } else {
                                selfCB(null);
                            }

                        })

                    }

                }, function (err1, data) {
                    sitesIteratorCB(null);
                })
            } else {
                sitesIteratorCB(null);
            }
        }
        async.each(sites || [], siteIterator, function (err) {
            cb(null, weatherData);
        });
    });

    //    db.find('sites', criteria, function(err, sites) {
    //        var weatherData = [];
    //        async.each(sites || [], function (site, sitesIteratorCB) {
    //
    //
    //            console.log("SITE ", site);
    //
    //            async.series({
    //
    //                sensorbox:function(selfCB) {
    //
    //
    //                    var sensorboxCriteria = {
    //                        condition: {site: site._id, typeName: 'Sensor Box'},
    //                        requiredFields: {}
    //                    };
    //
    //                    console.log("test.......sensorboxCriteria..devices......",sensorboxCriteria)
    //                    db.find('devices', sensorboxCriteria, function (err, devices) {
    //
    //
    //                        if (devices && devices.length) {
    //
    //                            async.each(devices || [], function (devices, devicesIteratorCB) {
    //
    //                                async.series({
    //                                    weather: function (selfcb) {
    //                                        var matchObj = {
    //                                            //"deviceId": "SENS0802",
    //                                            "device": devices._id,
    //                                            ts: {$gte: moment().startOf('day')._d, $lte: moment().endOf('day')._d}
    //                                        }
    //
    //                                        var criteria = {
    //                                            condition: matchObj,
    //                                            sort: {_id: -1},
    //                                            pagination: {limit: 1}
    //                                        };
    //
    //                                        db.find('message_history', criteria, function (err, docs) {
    //                                            console.log("message_history..11111111111....",docs)
    //                                            selfcb(err, docs)
    //                                        });
    //                                    }
    //                                }, function (err, data) {
    //
    //                                    //console.log("test.......1111111111111111111111111........",data)
    //                                    weatherData.push(data.weather);
    //                                    console.log(err, data);
    //                                    devicesIteratorCB(null);
    //                                })
    //
    //
    //                            }, function (err) {
    //                                selfCB(null);
    //                            });
    //
    //                        }
    //
    //                    })
    //
    //                },
    //                wstation : function(selfCB) {
    //
    //                    var wstationCriteria = {
    //                        condition : {site:site._id, typeName : 'WSTATION'},
    //                        requiredFields : {}
    //                    };
    //
    //                    db.find('devices', wstationCriteria, function(err, devices){
    //
    //                        console.log("Node X....................",devices)
    //                        if(devices && devices.length > 0){
    //
    //                            console.log("IF DEVICES ... ")
    //
    //                            async.each(devices || [], function (devices, devicesIteratorCB) {
    //
    //                                async.series({
    //                                    weather: function (selfcb) {
    //                                        var matchObj = {
    //
    //                                            "device": devices._id,
    //                                            ts: {$gte: moment().startOf('day')._d, $lte: moment().endOf('day')._d}
    //                                        }
    //
    //                                        var criteria = {
    //                                            condition: matchObj,
    //                                            sort: {_id: -1},
    //                                            pagination: {limit: 1}
    //                                        };
    //
    //                                        db.find('wstation_formatted_logs', criteria, function (err, docs) {
    //                                            selfcb(err, docs)
    //                                        });
    //                                    }
    //                                }, function (err, data) {
    //                                    weatherData.push(data.weather);
    //                                    //console.log(err, data);
    //                                    devicesIteratorCB(null);
    //                                })
    //
    //
    //                            }, function(err){
    //                                selfCB(null);
    //                            });
    //
    //                        }else{
    //
    //                            console.log("ELSE DEVICES ... ")
    //                            selfCB(null);
    //                        }
    //
    //                    })
    //
    //                }
    //
    //
    //        },function(err,data){
    //                sitesIteratorCB(null)
    //         })
    //
    //
    //        }, function(err){
    //
    //            console.log("weatherData..................",weatherData)
    //
    //            cb(err, weatherData);
    //        });
    //    });
}

var activePowerForCurrentDay = function (requestObject, cb) {

    async.series({

        activePower: function (selfcb) {

            var matchObj = {
                "deviceId": {
                    $in: ['WRTP4Q75', 'WRTP4Q8C']
                },
                ts: {
                    $gte: moment().startOf('day')._d,
                    $lte: moment().endOf('day')._d
                }
                //ts : {$gte : new Date('Fri Oct 03 2014 00:00:00 GMT+0530 (IST)') , $lte : new Date('Sat Oct 06 2014 00:00:00 GMT+0530 (IST)') }
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
                    $group: {
                        _id: {
                            site: "$site",
                            ts: "$ts"
                        },
                        activePower: {
                            $sum: '$Pac'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        ts: "$_id.ts",
                        activePower: "$activePower"
                    }
                },
                {
                    $sort: {
                        "ts": 1
                    }
                }
            ];


            db.aggregate('logs', criteria, function (err, docs) {

                if (!err && docs && docs.length) {

                    // console.log(docs.activePower._id.ts)
                } else {
                    console.log(err)
                }
                selfcb(err, docs);
            });

        }
    }, function (err, data) {

        cb(err, data)
    })

};


var activePowerVSPoa = function (requestObject, cb) {

    async.series({

        activePowerVSPoa: function (selfcb) {

            var matchObj = {
                "deviceId": {
                    $in: ['WRTP4Q75', 'WRTP4Q8C']
                },
                ts: {
                    $gte: moment().startOf('day')._d,
                    $lte: moment().endOf('day')._d
                }
                // ts : {$gte : new Date('Fri Oct 03 2014 00:00:00 GMT+0530 (IST)') , $lte : new Date('Sat Oct 06 2014 00:00:00 GMT+0530 (IST)') }
            }

            if (requestObject.dateRange && requestObject.dateRange.from && requestObject.dateRange.to) {
                matchObj.ts = {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
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
                    $group: {
                        _id: {
                            site: "$site",
                            ts: "$ts"
                        },
                        activePower: {
                            $sum: '$Pac'
                        },
                        poa: {
                            $avg: '$IntSolIrr'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        ts: "$_id.ts",
                        activePower: "$activePower",
                        poa: "$poa"
                    }
                },
                {
                    $sort: {
                        "ts": 1
                    }
                }
            ];


            db.aggregate('logs', criteria, function (err, docs) {

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



var activeVSpoa = function (requestObject, cb) {

    console.log("1111111111111111111", requestObject)

    async.series({
        activepower: function (selfcb) {
            var matchObj = {

                parameter: 'Pac',
                "deviceId": {
                    $in: ['WRTP4Q75', 'WRTP4Q8C']
                },
                ts: {
                    $gte: moment().startOf('day')._d,
                    $lte: moment().endOf('day')._d
                }
            }
            if (requestObject.dateRange && requestObject.dateRange.from && requestObject.dateRange.to) {
                matchObj.ts = {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            } else {
                matchObj.ts = {
                    $gte: moment().startOf(requestObject.groupBy)._d,
                    $lte: moment().endOf(requestObject.groupBy)._d
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

            //console.log("ts : ",matchObj.ts)
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
                            $divide: ["$sum", "$count"]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            ts: "$ts"
                        },
                        yield: {
                            $sum: '$yield'
                        }
                    }
                },

                {
                    $sort: {
                        '_id.ts': 1
                    }
                },
                {
                    $project: {
                        ts: "$_id.ts",
                        site: "$_id.site",
                        yield: "$yield"
                    }
                }
            ];

            db.aggregate(requestObject.groupBy || 'days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {
                    console.log(docs);
                    console.log("%$#%$#%#$%$#%")

                } else {
                    console.log(err)
                }
                selfcb(err, docs);
            });
        },
        poa: function (selfcb) {
            var matchObj = {

                parameter: 'IntSolIrr',
                "deviceId": {
                    $in: ['SENS0802']
                },
                ts: {
                    $gte: moment().startOf('day')._d,
                    $lte: moment().endOf('day')._d
                }
            }

            if (requestObject.dateRange && requestObject.dateRange.from && requestObject.dateRange.to) {
                matchObj.ts = {
                    $gte: requestObject.dateRange.from,
                    $lte: requestObject.dateRange.to
                }
            } else {
                matchObj.ts = {
                    $gte: moment().startOf(requestObject.groupBy)._d,
                    $lte: moment().endOf(requestObject.groupBy)._d
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
                        yield: {
                            $divide: ["$sum", "$count"]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            site: "$site",
                            ts: "$ts"
                        },
                        yield: {
                            $sum: '$yield'
                        }
                    }
                },
                {
                    $project: {
                        ts: "$_id.ts",
                        site: "$_id.site",
                        yield: "$yield"
                    }
                },
                {
                    $sort: {
                        'ts': 1
                    }
                }
            ];

            db.aggregate(requestObject.groupBy || 'days', criteria, function (err, docs) {

                if (!err && docs && docs.length > 0) {
                    console.log("IRRADIANCE ", docs)

                } else {
                    console.log(err)
                }
                selfcb(err, docs);
            });
        }
    }, function (err, obj) {
        dataMergerForAPVSPOA(obj.activepower, obj.poa, function (err, data) {
            cb(err, data);
        });

    })


};


var dataMergerForAPVSPOA = function (activepower, poa, cb) {
    if (activepower && poa && activepower.length > 0 && poa.length > 0) {

        var index = 0;
        var data = {}
        async.eachSeries(activepower || [], function (ap, iterator) {

            if (ap.ts.toString() == poa[index].ts.toString()) {
                data[ap.ts] = {
                    activepower: ap.yield,
                    poa: poa[index].yield
                }
            }
            index++;
            iterator(null);
        }, function (err) {
            cb(null, data);
        });

    } else {
        cb(null, {});
    }
}


var getHierarchy = function (requestObject, cb) {

    var data = {}

    var criteria = {
        condition: {
            customer: requestObject.user.customer
        },
        sort: {
            name: 1
        },
        //        pagination : {skip:0,limit:10},
        requiredFields: {
            name: 1,
            'meta.capacity': 1,
            lat: 1,
            long: 1,
            location: 1,
            displayName: 1
        }
    }


    //    console.log("REQUEST OBJECT : ",requestObject)


    if (requestObject.sites && requestObject.sites.length > 0) {
        criteria.condition._id = {
            $in: requestObject.sites
        }
    }

    //    console.log(JSON.stringify(criteria));

    db.find('sites', criteria, function (err, sites) {

        console.log("sites.........", sites)
        if (!err && sites) {

            var sitesIterator = function (site, sitesIteratorCB) {

                var zoneCriteria = {
                    condition: {
                        customer: requestObject.user.customer,
                        site: site._id
                    },
                    sort: {
                        name: 1
                    },
                    //        pagination : {skip:0,limit:10},
                    requiredFields: {
                        name: 1,
                        'meta.capacity': 1,
                        lat: 1,
                        long: 1,
                        location: 1,
                        displayName: 1
                    }
                }
                db.find('zones', zoneCriteria, function (err, zones) {

                    console.log(zones);

                    process.nextTick(function () {

                        //                        sitesIteratorCB(err)

                        //                        var criteria = [
                        //                            { $match: { zone: ObjectId('549e8e89c20e7d09edf723c9') } },
                        //                            { $sort: { name: 1 } },
                        //                            { $group: { _id: "$typeName", types: { $push:  { name: "$name", _id: "$_id" } } } },
                        //                            { $sort: { _id: 1 } }
                        //                        ]


                        var zonesIterator = function (zone, zoneIteratorCb) {
                            var deviceCriteria = [
                                {
                                    $match: {
                                        zone: zone._id
                                    }
                                },
                                {
                                    $sort: {
                                        name: 1
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$typeName",
                                        types: {
                                            $push: {
                                                name: "$name",
                                                _id: "$_id",
                                                meta: "$meta",
                                                displayName: "$displayName"
                                            }
                                        }
                                    }
                                },
                                {
                                    $sort: {
                                        _id: 1
                                    }
                                }
                            ]
                            db.aggregate('devices', deviceCriteria, function (deviceErr, deviceTypes) {
                                if (!deviceErr && deviceTypes && deviceTypes.length > 0) {
                                    zone.deviceType = deviceTypes;
                                    process.nextTick(function () {
                                        zoneIteratorCb(deviceErr);
                                    });
                                } else {
                                    process.nextTick(function () {
                                        zoneIteratorCb(null);
                                    });
                                }
                            })
                        }


                        async.each(zones || [], zonesIterator, function (zonesIteratorErr) {
                            site.zones = zones;
                            sitesIteratorCB(err)
                        })
                    })
                });



            };

            async.each(sites, sitesIterator, function () {
                cb(null, sites);
            })



        } else {
            cb(null, {});
        }
    });



}


var getSiteType = function (site) {

    var deviceCriteria = {
        condition: {
            site: site,
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    console.log(deviceCriteria)

    db.find('devices', deviceCriteria, function (err, devices) {

        if (devices) {

            return devices.typeName;
        } else {

            return "INVERTER";
        }

    });
}

var acVSPoa = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: {
                $in: requestObject.sites
            },
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    db.find('devices', deviceCriteria, function (err, devices) {

        if (devices && devices.length) {
            async.series({

                ap: function (selfcb) {

                    var matchObj = {
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }
                    };

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceTypeId: "$deviceTypeId",
                                ts: "$_h"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceTypeId: "$deviceTypeId",
                                ts: "$_d"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        }
                    }


                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceTypeId: "$deviceTypeId",
                                ts: "$_mo"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceTypeId: "$deviceTypeId",
                                ts: "$_y"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceTypeId: "$deviceTypeId",
                                ts: "$_dt"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
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
                            $group: {
                                "_id": {
                                    "site": "$_id.site",
                                    "ts": "$_id.ts"
                                },
                                "activePower": {
                                    "$sum": "$activePower"
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                activePower: "$activePower"
                            }
                        },
                        {
                            $sort: {
                                "ts": 1
                            }
                        }
                    ];

                    db.aggregate('grid_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {} else {
                            console.log(err)
                        }
                        selfcb(err, docs);
                    });

                },
                poa: function (selfcb) {

                    var matchObj = {
                        "deviceTypeId": devconfig.ws.MANG,
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }

                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceTypeId",
                                ts: "$_h"
                            },
                            poa: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceTypeId",
                                ts: "$_d"
                            },
                            poa: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceTypeId",
                                ts: "$_mo"
                            },
                            poa: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceTypeId",
                                ts: "$_y"
                            },
                            poa: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceTypeId",
                                ts: "$_dt"
                            },
                            poa: {
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
                                deviceSn: "$_id.deviceSn",
                                ts: "$_id.ts",
                                poa: "$poa"
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
                                    deviceSn: '$deviceSn'
                                },
                                dataPoints: {
                                    $push: {
                                        ts: '$ts',
                                        poa: "$poa"
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                deviceSn: '$_id.deviceSn',
                                dataPoints: "$dataPoints"
                            }
                        }
                    ];

                    db.aggregate('wstation_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {} else {
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

                ap: function (selfcb) {

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceSn",
                                ts: "$_h"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceSn",
                                ts: "$_d"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceSn",
                                ts: "$_mo"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceSn",
                                ts: "$_y"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceSn: "$deviceSn",
                                ts: "$_mi"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        }
                    }


                    var criteria = [
                        {
                            "$match": {
                                "ts": {
                                    "$gte": requestObject.dateRange.from,
                                    $lte: requestObject.dateRange.to
                                },
                                "site": {
                                    $in: requestObject.sites
                                }
                            }
                        },
                        {
                            $group: group_id
                        },
                        {
                            "$group": {
                                "_id": {
                                    "site": "$_id.site",
                                    "ts": "$_id.ts"
                                },
                                "activePower": {
                                    "$sum": "$activePower"
                                }
                            }
                        },
                        {
                            "$project": {
                                "_id": 0,
                                "ts": "$_id.ts",
                                "activePower": "$activePower"
                            }
                        }, {
                            "$sort": {
                                "ts": 1
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

                },

                poa: function (selfcb) {

                    var matchObj = {
                        "typeName": "Sensor Box",
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        },
                        "site": {
                            $in: requestObject.sites
                        }
                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceId",
                                deviceSn: "$deviceSn",
                                ts: "$_h"
                            },
                            poa: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceId",
                                deviceSn: "$deviceSn",
                                ts: "$_d"
                            },
                            poa: {
                                "$avg": "$POA"
                            }
                        }
                    }


                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceId",
                                deviceSn: "$deviceSn",
                                ts: "$_mo"
                            },
                            poa: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceId",
                                deviceSn: "$deviceSn",
                                ts: "$_y"
                            },
                            poa: {
                                "$avg": "$POA"
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                site: "$site",
                                deviceId: "$deviceId",
                                deviceSn: "$deviceSn",
                                ts: "$_mi"
                            },
                            poa: {
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
                                deviceSn: '$_id.deviceSn',
                                ts: "$_id.ts",
                                poa: "$poa"
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
                                    deviceSn: '$deviceSn'
                                },
                                dataPoints: {
                                    $push: {
                                        ts: '$ts',
                                        poa: "$poa"
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                deviceSn: '$_id.deviceSn',
                                dataPoints: "$dataPoints"
                            }
                        }

                    ];
                    db.aggregate('message_history', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {} else {
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

var specificPower = function (requestObject, cb) {
    var deviceCriteria = {
        condition: {
            site: {
                $in: requestObject.sites
            },
            typeName: 'GMETER'
        },
        requiredFields: {}
    };

    db.find('devices', deviceCriteria, function (err, devices) {
        if (devices && devices.length) {

            async.series({
                specificPower: function (selfcb) {

                    var matchObj = {
                        _dt: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        }
                    }

                    console.log(JSON.stringify(matchObj));

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                zone: "$zone",
                                ts: "$_h"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        };
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                zone: "$zone",
                                ts: "$_d"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        };
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                zone: "$zone",
                                ts: "$_mo"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        };
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                zone: "$zone",
                                ts: "$_y"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        };
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                zone: "$zone",
                                ts: "$_dt"
                            },
                            activePower: {
                                "$avg": "$gridActivePower"
                            }
                        };
                    }


                    var criteria = [
                        {
                            $match: matchObj
                        },
                        {
                            $group: group_id
                        },
                        {
                            $group: {
                                "_id": {
                                    "zone": "$_id.zone",
                                    "ts": "$_id.ts"
                                },
                                "activePower": {
                                    "$sum": "$activePower"
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                zone: "$_id.zone",
                                activePower: "$activePower"
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
                                    zone: "$zone"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'activePower': '$activePower'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                zone: '$_id.zone',
                                values: '$data'
                            }
                        }
                    ];

                    console.log(criteria);

                    db.aggregate('grid_formatted_logs', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {} else {
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
                specificPower: function (selfcb) {
                    var matchObj = {
                        ts: {
                            $gte: requestObject.dateRange.from,
                            $lte: requestObject.dateRange.to
                        },
                        site: {
                            $in: requestObject.sites
                        }
                    }

                    var group_id = {};

                    if (requestObject.groupBy == 'hours') {
                        group_id = {
                            _id: {
                                ts: "$_h",
                                deviceSn: "$deviceSn",
                                zone: "$zone"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        };
                    }

                    if (requestObject.groupBy == 'days') {
                        group_id = {
                            _id: {
                                ts: "$_d",
                                deviceSn: "$deviceSn",
                                zone: "$zone"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        }
                    }

                    if (requestObject.groupBy == 'months') {
                        group_id = {
                            _id: {
                                ts: "$_mo",
                                deviceSn: "$deviceSn",
                                zone: "$zone"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        }
                    }

                    if (requestObject.groupBy == 'years') {
                        group_id = {
                            _id: {
                                ts: "$_y",
                                deviceSn: "$deviceSn",
                                zone: "$zone"
                            },
                            activePower: {
                                $avg: '$invActivePower'
                            }
                        }
                    }

                    if (requestObject.groupBy == 'live') {
                        group_id = {
                            _id: {
                                ts: "$_mi",
                                deviceSn: "$deviceSn",
                                zone: "$zone"
                            },
                            activePower: {
                                $avg: '$invActivePower'
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
                            $group: {
                                "_id": {
                                    "zone": "$_id.zone",
                                    "ts": "$_id.ts"
                                },
                                "activePower": {
                                    "$sum": "$activePower"
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                ts: "$_id.ts",
                                zone: "$_id.zone",
                                activePower: "$activePower"
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
                                    zone: "$zone"
                                },
                                data: {
                                    "$push": {
                                        ts: '$ts',
                                        'activePower': '$activePower'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                zone: '$_id.zone',
                                values: '$data'
                            }
                        }
                    ];

                    db.aggregate('message_history', criteria, function (err, docs) {

                        if (!err && docs && docs.length) {} else {
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
}

var zonePR = function (requestObject, cb) {


    try {


        var site = requestObject.sites;

        async.series({

            zonePR: function (selfcb) {
                var matchObj = {
                    "_id.site": site,
                    "_id.ts": {
                        $gte: moment().startOf('day')._d,
                        $lte: moment().endOf('day')._d
                    }
                    //"_id.ts": {$gte: new Date('Tue Dec 30 2014 00:00:00 GMT+0530 (IST)'), $lte: new Date('Tue Dec 30 2014 23:59:59 GMT+0530 (IST)') }
                }

                console.log(matchObj)
                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $project: {
                            "_id.ts": 1,
                            "_id.site": 1,
                            "_id.zone": 1,
                            "capacity.value": 1,
                            "orientation": 1,
                            "energyGenreation": 1,
                            "poa": 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                ts: '$_id.ts',
                                site: "$_id.site",
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
                    }
            ];

                db.aggregate('poaGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {
                        console.log('Poa:' + JSON.stringify(docs));
                    } else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });


            }
        }, function (err, data) {

            cb(err, data)
        })


    } catch (e) {
        console.log(e)
    }


}

var devicePR = function (requestObject, cb) {
    try {
        async.series({

            devicePR: function (selfcb) {
                var matchObj = {
                    "_id.zone": requestObject.zones,
                    "_id.ts": {
                        $gte: moment().startOf('day')._d,
                        $lte: moment().endOf('day')._d
                    }
                    //"_id.ts": {$gte: new Date('Tue Dec 30 2014 00:00:00 GMT+0530 (IST)'), $lte: new Date('Tue Dec 30 2014 23:59:59 GMT+0530 (IST)') }
                }

                console.log(matchObj)
                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $project: {
                            "_id.ts": 1,
                            "_id.site": 1,
                            "_id.zone": 1,
                            "_id.device": 1,
                            "capacity.value": 1,
                            "orientation": 1,
                            "energyGenreation": 1,
                            "poa": 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                ts: '$_id.ts',
                                site: "$_id.site",
                                zone: "$_id.zone",
                                device: "$_id.device",
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
                    }
                ];

                db.aggregate('poaGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {
                        console.log('Poa:' + JSON.stringify(docs));
                    } else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });


            }
        }, function (err, data) {

            cb(err, data)
        })

    } catch (e) {
        console.log(e)
    }
}


var plantYield = function (requestObject, cb) {
    try {
        async.series({
            plantYield: function (selfcb) {
                var matchObj = {
                    "_id.site": {
                        $in: requestObject.sites
                    },
                    "_id.ts": {
                        $gte: requestObject.dateRange.from,
                        $lte: requestObject.dateRange.to
                    }
                }

                var project_id = {};
                var group_id = {};
                if (requestObject.groupBy == 'hours') {
                    project_id = {
                        "_id._h": 1,
                        "_id.site": 1,
                        "yield": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._h',
                            site: "$_id.site"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                } else if (requestObject.groupBy == 'days') {
                    project_id = {
                        "_id._d": 1,
                        "_id.site": 1,
                        "yield": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._d',
                            site: "$_id.site"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                } else if (requestObject.groupBy == 'months') {
                    project_id = {
                        "_id._mo": 1,
                        "_id.site": 1,
                        "yield": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._mo',
                            site: "$_id.site"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                } else if (requestObject.groupBy == 'years') {
                    project_id = {
                        "_id._y": 1,
                        "_id.site": 1,
                        "yield": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._y',
                            site: "$_id.site"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                }

                console.log(matchObj)
                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $project: project_id
                    },
                    {
                        $group: group_id
                    },
                    {
                        $sort: {
                            "_id.ts": 1
                        }
                    }
                ];

                db.aggregate('energyGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {} else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });
            }
        }, function (err, data) {

            cb(err, data)
        })
    } catch (e) {
        console.log(e)
    }
}


var siteSummary = function (requestObject, cb) {
    try {
        async.parallel({

            siteSummary: function (selfcb) {

                var matchObj = {
                    //"_id.zone":requestObject.zones,
                    "_id.site": {
                        $in: requestObject.sites
                    },
                    "_id.ts": {
                        $gte: requestObject.dateRange.from,
                        $lte: requestObject.dateRange.to
                    }
                    //"_id.ts" : {$gte : moment().startOf('day')._d , $lte : moment().endOf('day')._d}
                    //"_id.ts": {$gte: new Date('Tue Dec 30 2014 00:00:00 GMT+0530 (IST)'), $lte: new Date('Tue Dec 30 2014 23:59:59 GMT+0530 (IST)') }
                }

                console.log(matchObj)
                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $project: {
                            "_id.ts": 1,
                            "_id.site": 1,
                            "_id.zone": 1,
                            "_id.device": 1,
                            "capacity.value": 1,
                            "orientation": 1,
                            "energyGenreation": 1,
                            "poa": 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                ts: '$_id.ts',
                                site: "$_id.site",
                                zone: "$_id.zone",
                                device: "$_id.device",
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
                        $sort: {
                            "_id.ts": 1
                        }
                    }
                ];

                db.aggregate('poaGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {
                        console.log('Poa:' + JSON.stringify(docs));
                    } else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });

            }
        }, function (err, data) {

            console.log("data seven days...................", data)

            cb(err, data)
        })
    } catch (e) {
        console.log(e)
    }
}


var siteAggregatePR = function (requestObject, cb) {
    try {
        async.series({
            poaEnergy: function (selfcb) {
                var matchObj = {
                    "_id.site": {
                        $in: requestObject.sites
                    },
                    "_id.ts": {
                        $gte: requestObject.dateRange.from,
                        $lte: requestObject.dateRange.to
                    }
                }

                var project_id = {};
                var group_id = {};
                if (requestObject.groupBy == 'hours') {
                    project_id = {
                        "_id._h": 1,
                        "_id.site": 1,
                        "energyGenreation": 1,
                        "poa": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._h',
                            site: "$_id.site"
                        },
                        totalPoa: {
                            $sum: '$poa'
                        }
                    }
                } else if (requestObject.groupBy == 'days') {
                    project_id = {
                        "_id._d": 1,
                        "_id.site": 1,
                        "energyGenreation": 1,
                        "poa": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._d',
                            site: "$_id.site"
                        },
                        totalPoa: {
                            $sum: '$poa'
                        }
                    }
                } else if (requestObject.groupBy == 'months') {
                    project_id = {
                        "_id._mo": 1,
                        "_id.site": 1,
                        "energyGenreation": 1,
                        "poa": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._mo',
                            site: "$_id.site"
                        },
                        totalPoa: {
                            $sum: '$poa'
                        }
                    }
                } else if (requestObject.groupBy == 'years') {
                    project_id = {
                        "_id._y": 1,
                        "_id.site": 1,
                        "energyGenreation": 1,
                        "poa": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._y',
                            site: "$_id.site"
                        },
                        totalPoa: {
                            $sum: '$poa'
                        }
                    }
                }

                console.log(matchObj)
                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $project: project_id
                    },
                    {
                        $group: group_id
                    },
                    {
                        $sort: {
                            "_id.ts": 1
                        }
                    }
                ];

                db.aggregate('poaGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {} else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });
            },

            plantYield: function (selfcb) {
                var matchObj = {
                    "_id.site": {
                        $in: requestObject.sites
                    },
                    "_id.ts": {
                        $gte: requestObject.dateRange.from,
                        $lte: requestObject.dateRange.to
                    }
                }

                var project_id = {};
                var group_id = {};
                if (requestObject.groupBy == 'hours') {
                    project_id = {
                        "_id._h": 1,
                        "_id.site": 1,
                        "yield": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._h',
                            site: "$_id.site"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                } else if (requestObject.groupBy == 'days') {
                    project_id = {
                        "_id._d": 1,
                        "_id.site": 1,
                        "yield": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._d',
                            site: "$_id.site"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                } else if (requestObject.groupBy == 'months') {
                    project_id = {
                        "_id._mo": 1,
                        "_id.site": 1,
                        "yield": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._mo',
                            site: "$_id.site"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                } else if (requestObject.groupBy == 'years') {
                    project_id = {
                        "_id._y": 1,
                        "_id.site": 1,
                        "yield": 1
                    };
                    group_id = {
                        _id: {
                            ts: '$_id._y',
                            site: "$_id.site"
                        },
                        yield: {
                            $sum: "$yield"
                        }
                    }
                }

                console.log(matchObj)
                var criteria = [
                    {
                        $match: matchObj
                    },
                    {
                        $project: project_id
                    },
                    {
                        $group: group_id
                    },
                    {
                        $sort: {
                            "_id.ts": 1
                        }
                    }
                    ];

                db.aggregate('energyGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {} else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });
            }
        }, function (err, data) {

            cb(err, data)
        })
    } catch (e) {
        console.log(e)
    }
}





module.exports = {
    validateSiteName: validateSiteName,
    create: create,
    edit: edit,
    disable: disable,
    list: list,
    count: count,
    mapred: mapred,
    listIdText: listIdText,
    status: status,
    allstatus: allstatus,
    weather: weather,
    pr: pr,
    energy: energy,
    activePowerForCurrentDay: activePowerForCurrentDay,
    activePowerVSPoa: activePowerVSPoa,
    activeVSpoa: activeVSpoa,
    getHierarchy: getHierarchy,
    acVSPoa: acVSPoa,
    zonePR: zonePR,
    devicePR: devicePR,
    plantYield: plantYield,
    specificPower: specificPower,
    siteSummary: siteSummary,
    siteAggregatePR: siteAggregatePR
}