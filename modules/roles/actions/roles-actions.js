/**
 * Created by Sneha on 22/9/14.
 */


/* Supporting Node Modules */
var async = require('async');
var _ = require('underscore');


/* System Modules */
var ReqCS = require(global.root+'/modules/global/helpers/request-object-construction-service');
var ResCS = require(global.root+'/modules/global/helpers/response-object-construction-service');
var roleService = require('./../services/roles-service');

/* Create Actions */
var create = function(req, res){
//    console.log("Inside role-action's create function ")
    async.parallel({
        rolename: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.rolename, cb);
        },
        roledetails: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.roledetails, cb);
        },
        user : function(cb){
            ReqCS.sessionUser(req, cb);
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        }
    }, function(err, requestObject){
        async.series({

            role: function (cb) {
                roleService.create(requestObject, cb)
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

        roleId : function(cb){
        ReqCS.getObjectId(req.body.roleId, cb);
        },
        rolename: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.rolename, cb);
        },
        roledetails: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.roledetails, cb);
        },
        user : function(cb){
            ReqCS.sessionUser(req, cb);
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        }
    }, function(err, requestObject){
        async.series({
            role: function (cb) {
                roleService.edit(requestObject, cb);
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
        roleId : function(cb){
            ReqCS.getObjectId(req.body.roleId, cb);
        }
    }, function(err, requestObject){
        async.series({

            role: function (cb) {
                roleService.disable(requestObject, cb);
            }
        }, function (err, _object) {
            var response = {
                status: err ? 400 : 200,
                data: err || "DISABLED"
            }
            res.send(response);
        });
    })
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
        }

    }, function (err, requestObject) {

        async.parallel({
            list : function(cb) {
                roleService.list(requestObject, cb);
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
                roleService.listIdText(requestObject, cb);
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
    create : create,
    edit : edit,
    disable : disable,
    list : list,
    listIdText : listIdText
};
