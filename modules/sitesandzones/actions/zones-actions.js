/**
 * Created by harinaths on 19/8/14.
 */


/* Supporting Node Modules */
var async = require('async');
var _ = require('underscore');


/* System Modules */
var ReqCS = require(global.root+'/modules/global/helpers/request-object-construction-service');
var ResCS = require(global.root+'/modules/global/helpers/response-object-construction-service');
var zoneService = require('./../services/zones-service');


/* Create Actions */
var create = function(req, res){

    async.parallel({
        name: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.name, cb);
        },
        location: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.location, cb);
        },
        meta : function(cb){
            ReqCS.setPassedArgumentsStrict(req.body.meta, cb);
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        },
        user : function(cb){
            ReqCS.sessionUser(req, cb);
        },
        site :function (cb) {
            ReqCS.getObjectId(req.body.site, cb)
        }
    }, function(err, requestObject){

        async.series({

            zone: function (cb) {
                zoneService.create(requestObject, cb)
            }

        }, function (err, _object) {

            var response = {
                status: err ? 400 : 200,
                data: err || "CREATED"
            }
            res.send(response);

        });



    })

};

var edit = function(req, res){

    async.parallel({
        name: function (cb) {
            ReqCS.setPassedArguments(req.body.name, cb);
        },
        location: function (cb) {
            ReqCS.setPassedArguments(req.body.location, cb);
        },
        meta : function(cb){
            ReqCS.setPassedArguments(req.body.meta, cb);
        },
        user : function(cb){
            ReqCS.sessionUser(req, cb);
        },
        site : function(cb){
            ReqCS.getObjectId(req.body.site, cb);
        },
        zone : function(cb){
            ReqCS.getObjectId(req.body.zone, cb);
        }
    }, function(err, requestObject){

        async.series({

            zone: function (cb) {
                zoneService.edit(requestObject, cb);
            }

        }, function (err, _object) {

            var response = {
                status: err ? 400 : 200,
                data: err || "UPDATED"
            }
            res.send(response);

        });



    })

};



var disable = function(req, res){

    async.parallel({

        user : function(cb){
            ReqCS.sessionUser(req, cb);createSite
        },
        zone : function(cb){
            ReqCS.getObjectId(req.body.zone, cb);
        },
        customer: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        }
    }, function(err, requestObject){

        async.series({

            site: function (cb) {
                zoneService.disable(requestObject, cb);
            }

        }, function (err, _object) {

            var response = {
                status: err ? 400 : 200,
                data: err || "UPDATED"
            }
            res.send(response);

        });



    })

};

/* Validate Zone Name */
var validateName = function (req, res) {

    async.parallel({

        name: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.query.name, cb)
        },
        site :function (cb) {
            ReqCS.getObjectId(req.query.site, cb)
        },
//        customerId: function (cb) {
//            ReqCS.sessionUsersCustomerId(req, cb)
//        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb)
        }

    }, function (err, requestObject) {



        async.series({

            validataion: function (cb) {
                zoneService.validateName(requestObject, cb)
            }

        }, function (err, _object) {

            var response = {
                status: err ? 400 : 200,
                data: err || _object.validataion
            }
            res.send(response)

        });






    });

};

var list = function(req, res) {
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
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        },
        site :function (cb) {
            ReqCS.getObjectId(req.query.site, cb)
        }

    }, function (err, requestObject) {

        async.parallel({
            list : function(cb) {
                zoneService.list(requestObject, cb);
            }
        },function(err, data){
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta : {
                    pagination : requestObject.pagination,
                    sort : requestObject.sort
                }
            }
            res.send(response);

        })

    });
};

var listncount = function(req, res) {
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
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        },
        site :function (cb) {
            ReqCS.getObjectId(req.query.site, cb)
        }

    }, function (err, requestObject) {

        async.parallel({
            list : function(cb) {
                zoneService.list(requestObject, cb);
            },
            count : function(cb) {
                zoneService.count(requestObject, cb);
            }
        },function(err, data){
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta : {
                    pagination : requestObject.pagination,
                    sort : requestObject.sort
                }
            }
            res.send(response);

        })

    });
};

var count = function(req, res) {
    async.parallel({

        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            count : function(cb) {
                zoneService.count(requestObject, cb);
            }
        },function(err, data){
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta : {
                    pagination : requestObject.pagination,
                    sort : requestObject.sort
                }
            }
            res.send(response);

        })

    });
};



var listIdText = function(req, res) {
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
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            list : function(cb) {
                zoneService.listIdText(requestObject, cb);
            }
        },function(err, data){
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta : {
                    pagination : requestObject.pagination,
                    sort : requestObject.sort
                }
            }
            res.send(response);

        })

    });
};

var status = function(req, res){
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
            ReqCS.getAsObjectIds(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getAsObjectIds(req.body.zones, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy, cb);
        },
        date : function(cb){
            ReqCS.setPassedArguments(req.body.date, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            data : function(cb) {
                zoneService.status(requestObject, cb);
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

var newstatus = function(req, res){
    async.parallel({
        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        sites: function (cb) {
            ReqCS.getAsObjectIds(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getAsObjectIds(req.body.zones, cb);
        },
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.date, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            data : function(cb) {
                zoneService.newStatus(requestObject, cb);
            }
        },function(err, data){

            var sortedData = _.sortBy( data, 'energyYield' );
            var response = {
                status: err ? 400 : 200,
                data: err || sortedData,
                meta : {
                    pagination : requestObject.pagination,
                    sort : requestObject.sort
                }
            };
            res.send(response);

        })

    });
};


var activePowerTrend = function(req, res){
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


var plantYield = function(req, res){
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
        }
    }, function (err, requestObject) {


        async.parallel({
            activePower: function (cb) {
                zoneService.plantYield(requestObject, cb);
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


var parameters = function(req, res){
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
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy, cb);
        },
        date : function(cb){
            ReqCS.setPassedArguments(req.body.date, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            data : function(cb) {
                zoneService.parameters(requestObject, cb);
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


var zoneAggregatePR = function(req, res){
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
            ReqCS.getAsObjectIds(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getAsObjectIds(req.body.zones, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy, cb);
        },
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.date, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                zoneService.zoneAggregatePR(requestObject, cb);
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



var zonePeakPower = function(req, res){
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
            ReqCS.getAsObjectIds(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getAsObjectIds(req.body.zones, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy, cb);
        },
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.date, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                zoneService.zonePeakPower(requestObject, cb);
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

/* ACTIONS */
module.exports = {
    validateName : validateName,
    create : create,
    edit : edit,
    disable : disable,
    list : list,
    count : count,
    status : status,
    newstatus:newstatus,
    listncount : listncount,
    listIdText : listIdText,
    parameters : parameters,
    plantYield : plantYield,
    activePowerTrend: activePowerTrend,
    zoneAggregatePR : zoneAggregatePR,
    zonePeakPower:zonePeakPower
};
