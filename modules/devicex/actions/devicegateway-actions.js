/**
 * Created by harinaths on 19/8/14.
 */


/* Supporting Node Modules */
var async = require('async');
var _ = require('underscore');


/* System Modules */
var ReqCS = require(global.root+'/modules/global/helpers/request-object-construction-service');
var ResCS = require(global.root+'/modules/global/helpers/response-object-construction-service');
var devicegatewayService = require('./../services/devicegateway-service');


/* Create Actions */
var create = function(req, res){

    async.parallel({
        name: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.name, cb);
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
            ReqCS.getObjectId(req.body.site, cb);
        },
        zone :function (cb) {
            ReqCS.getObjectId(req.body.zone, cb);
        }

    }, function(err, requestObject){

        async.series({

            zone: function (cb) {
                devicegatewayService.create(requestObject, cb)
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
        meta : function(cb){
            ReqCS.setPassedArguments(req.body.meta, cb);
        },
        user : function(cb){
            ReqCS.sessionUser(req, cb);
        },
        devicegateway : function(cb){
            ReqCS.getObjectId(req.body.devicegateway, cb);
        }
    }, function(err, requestObject){

        async.series({

            devicegateway: function (cb) {
                devicegatewayService.edit(requestObject, cb);
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
            ReqCS.sessionUser(req, cb);
        },
        devicegateway : function(cb){
            ReqCS.getObjectId(req.body.devicegateway, cb);
        },
        customer: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        }
    }, function(err, requestObject){

        async.series({

            site: function (cb) {
                devicegatewayService.disable(requestObject, cb);
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
        zone :function (cb) {
            ReqCS.getObjectId(req.query.zone, cb)
        }


    }, function (err, requestObject) {



        async.series({

            validataion: function (cb) {
                devicegatewayService.validateName(requestObject, cb)
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
        },
        zone :function (cb) {
            ReqCS.getObjectId(req.query.zone, cb)
        }

    }, function (err, requestObject) {

        async.parallel({
            list : function(cb) {
                devicegatewayService.list(requestObject, cb);
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
                devicegatewayService.list(requestObject, cb);
            },
            count : function(cb) {
                devicegatewayService.count(requestObject, cb);
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
                devicegatewayService.count(requestObject, cb);
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


/* ACTIONS */
module.exports = {
    validateName : validateName,
    create : create,
    edit : edit,
    disable : disable,
    list : list,
    count : count,
    listncount : listncount
};
