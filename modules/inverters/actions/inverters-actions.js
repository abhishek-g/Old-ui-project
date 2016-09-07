/**
 * Created by anand on 13/11/14.
 */

/* Supporting Node Modules */
var async = require('async');
var _ = require('underscore');

/* System Modules */
var ReqCS = require(global.root + '/modules/global/helpers/request-object-construction-service');
var ResCS = require(global.root + '/modules/global/helpers/response-object-construction-service');
var inverterService = require('./../services/inverters-service');

/* Create Actions */
var status = function (req, res) {

    async.parallel({

        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            data: function (cb) {
                inverterService.invCommunicationStatus(requestObject, cb);
            },
            energyYield: function (cb) {
                inverterService.energyYield(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta: {
                    pagination: requestObject.pagination,
                    sort: requestObject.sort
                }
            };
            res.send(response);

        })

    });
};

var alarms = function (req, res) {

    async.parallel({
        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        pagination: function (cb) {
            ReqCS.pagination(req, cb)
        },
        sort: function (cb) {
            ReqCS.sort(req, cb)
        },
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        deviceIds: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceIds, cb);
        },
        typeName: function (cb) {
            ReqCS.setPassedArguments(req.body.typeName, cb);
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            list: function (cb) {
                inverterService.Alarms(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta: {
                    pagination: requestObject.pagination,
                    sort: requestObject.sort
                }
            }
            res.send(response);

        })

    });
}


var gAlarms = function (req, res) {

    async.parallel({
        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        deviceIds: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceIds, cb);
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'site', cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            list: function (cb) {
                inverterService.gAlarms(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data
            }
            res.send(response);

        })
    });
}


var alarmList = function (req, res) {

    console.log("IIIIIIIIIIIIIIII",req.body)

    async.parallel({
        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        pagination: function (cb) {
            ReqCS.pagination(req, cb)
        },
        sort: function (cb) {
            ReqCS.sort(req, cb)
        },
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        deviceIds: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceIds, cb);
        },
        typeName: function (cb) {
            ReqCS.setPassedArguments(req.body.typeName, cb);
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date,cb);
        },
        search: function (cb) {
            ReqCS.setPassedArguments(req.body.search.value, cb);
        }
    }, function (err, requestObject) {



        async.parallel({
            list: function (cb) {
                inverterService.alarmList(requestObject, cb);
            },
            count: function (cb) {
                inverterService.alarmCount(requestObject, cb);
            }
        }, function (err, data) {
            data['draw'] = req.query.draw;
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta: {
                    pagination: requestObject.pagination,
                    sort: requestObject.sort
                }
            }
            res.send(response);

        })

    });
}


var list = function (req, res) {
    async.parallel({

        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        pagination: function (cb) {
            ReqCS.pagination(req, cb)
        },
        sort: function (cb) {
            ReqCS.sort(req, cb)
        },
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        deviceIds: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceIds, cb);
        },
        typeName: function (cb) {
            ReqCS.setPassedArguments(req.body.typeName, cb);
        },

        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            list: function (cb) {
                inverterService.list(requestObject, cb);
            }
        }, function (err, data) {
            data['draw'] = req.query.draw;
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta: {
                    pagination: requestObject.pagination,
                    sort: requestObject.sort
                }
            }
            res.send(response);

        })

    });
}


var alarmsp = function (req, res) {

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
        site: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },

        alarms: function (cb) {
            var alarm_ar = [];
            async.each(req.body.alarmIds || [], function (alarmId, ecb) {
                ReqCS.getObjectId(alarmId, function (err, alarmObjId) {
                    alarm_ar.push(alarmObjId);
                    ecb();
                });
            }, function (err) {
                if (!err) {

                    cb(null, alarm_ar);
                }
            });

        }

    }, function (err, requestObject) {
        async.parallel({
            data: function (cb) {
                inverterService.updateAlarms(requestObject, cb);
            }
        }, function (err, results) {
            var response = {
                status: err ? 400 : 200,
                data: err || (results.data[0])
                //                        data: err || (results && results.data)
            }
            res.send(response);
        })
    })
}


var editAlarmsp = function (req, res) {
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
        site: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        alarms: function (cb) {
            var alarm_id = null;
            ReqCS.getObjectId(req.body.editDetails.alarmId, function (err, alarmObjId) {
                alarm_id = alarmObjId;
            });
            cb(null, alarm_id);
        },
        comment: function (cb) {
            cb(null, req.body.editDetails.comment);
        }

    }, function (err, requestObject) {
        async.parallel({
            data: function (cb) {
                inverterService.editAlarms(requestObject, cb);
            }
        }, function (err, results) {

            console.log("response in inverter-action class",results);

            var response = {
                status: err ? 400 : 200,
                data: err || (results)
            };

            res.send(response);
        })
    })
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                inverterService.activePowerForCurrentDay(requestObject, cb);
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


var modTempVsAmpTempTrend = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                inverterService.modTempVSAmpTempForSite(requestObject, cb);
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



var modTempTrend = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                inverterService.modTempForCurrentDay(requestObject, cb);
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

var ambTempTrend = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            ambTemp: function (cb) {
                inverterService.ambTempForCurrentDay(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.ambTemp

            }
            res.send(response);

        })
    });
};

var windSpeedTrend = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            windSpeed: function (cb) {
                inverterService.windSpeedForCurrentDay(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.windSpeed
            }
            res.send(response);
        })
    });
};

var poaTrend = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            poa: function (cb) {
                inverterService.poaForCurrentDay(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.poa
            }
            res.send(response);
        })
    });
};





var pr = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        deviceSns: function (cb) {
            ReqCS.setPassedArray(req.body.deviceSns, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }

    }, function (err, requestObject) {
        async.parallel({
            energyYield: function (cb) {
                inverterService.eTotal(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.energyYield

            }
            res.send(response);

        })
    });
};

var ws = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.dateRange, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }

    }, function (err, requestObject) {
        async.parallel({
            ws: function (cb) {
                inverterService.ws(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.ws

            }
            res.send(response);

        })
    });
};


var wsamb = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }

    }, function (err, requestObject) {
        async.parallel({
            ws: function (cb) {
                inverterService.wsamb(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.ws

            }
            res.send(response);

        })
    });
};


var prs = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        deviceSns: function (cb) {
            ReqCS.setPassedArray(req.body.deviceSns, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }

    }, function (err, requestObject) {
        async.parallel({
            energyYield: function (cb) {
                inverterService.prs(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.energyYield

            }
            res.send(response);

        })
    });
};


var parameters = function (req, res) {
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
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            data: function (cb) {
                inverterService.parameters(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta: {
                    pagination: requestObject.pagination,
                    sort: requestObject.sort
                }
            };
            res.send(response);

        })

    });
};

var gstatus = function(req, res) {

    async.parallel({

        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.date, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            data : function(cb) {
                inverterService.gmeterCommunicationStatus(requestObject, cb);
            },
            energyYield : function(cb)  {
                inverterService.gmeterenergyYield(requestObject, cb);
            }
        },function(err, data){
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta : {
                    pagination : requestObject.pagination,
                    sort : requestObject.sort
                }
            };
            res.send(response);

        })

    });
};

var gparameters = function(req, res){
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
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.dateRange, cb);
        },
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            data : function(cb) {
                inverterService.gparameters(requestObject, cb);
            }
        },function(err, data){
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta : {
                    pagination : requestObject.pagination,
                    sort : requestObject.sort
                }
            };
            res.send(response);

        })

    });
};

var wsDailyWhm2 = function (req, res) {
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }

    }, function (err, requestObject) {
        async.parallel({
            ws: function (cb) {
                inverterService.wsDailyWhm2(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.ws

            }
            console.log(response);
            res.send(response);

        })
    });
};

var windTrend = function (req, res) {

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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        dateRange: function (cb) {
            ReqCS.getDateRange(req.body.date, cb);
        },
        deviceSn: function (cb) {
            ReqCS.setPassedArguments(req.body.deviceSn, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }

    }, function (err, requestObject) {
        async.parallel({
            windTrend: function (cb) {
                inverterService.WindDirectionSpeedTrend(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.windTrend

            }
            res.send(response);

        })
    });
};




/* ACTIONS */
module.exports = {
    status: status,
    alarms: alarms,
    alarmsp: alarmsp,
    editAlarmsp: editAlarmsp,
    gAlarms : gAlarms,
    alarmList : alarmList,
    list : list,
    activePowerTrend : activePowerTrend,
    modTempTrend : modTempTrend,
    ambTempTrend : ambTempTrend,
    windSpeedTrend : windSpeedTrend,
    poaTrend : poaTrend,
    pr : pr,
    prs : prs,
    ws : ws,
    wsamb : wsamb,
    parameters : parameters,
    gparameters : gparameters,
    gstatus : gstatus,
    modTempVsAmpTempTrend: modTempVsAmpTempTrend,
    wsDailyWhm2 : wsDailyWhm2,
    windTrend: windTrend
};