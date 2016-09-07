/**
 * Created by harinaths on 19/8/14.
 */


/* Supporting Node Modules */
var async = require('async');
var _ = require('underscore');


/* System Modules */
var ReqCS = require(global.root + '/modules/global/helpers/request-object-construction-service');
var ResCS = require(global.root + '/modules/global/helpers/response-object-construction-service');
var devicetypeService = require('./../services/devicetypes-service');


/* Create Actions */
var create = function (req, res) {

    async.parallel({
        name: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.name, cb);
        },
        serialNumber : function(cb){
            ReqCS.setPassedArgumentsStrict(req.body.serialNumber, cb);
        },
        site : function(cb){
            ReqCS.getObjectId(req.body.site, cb);
        },
        zone : function(cb){
            ReqCS.getObjectId(req.body.zone, cb);
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        },
        user: function (cb) {
            ReqCS.sessionUser(req, cb);
        }
    }, function (err, requestObject) {


        async.series({

            devicetype: function (cb) {
                devicetypeService.create(requestObject, cb)
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

var edit = function (req, res) {

    async.parallel({
        name: function (cb) {
            ReqCS.setPassedArguments(req.body.name, cb);
        },
        user: function (cb) {
            ReqCS.sessionUser(req, cb);
        },
        devicetype: function (cb) {
            ReqCS.getObjectId(req.body.devicetype, cb);
        }
    }, function (err, requestObject) {

        async.series({

            devicetype: function (cb) {
                devicetypeService.edit(requestObject, cb);
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


var disable = function (req, res) {

    async.parallel({

        user: function (cb) {
            ReqCS.sessionUser(req, cb);
        },
        siteId: function (cb) {
            ReqCS.getObjectId(req.body.siteId, cb);
        }
    }, function (err, requestObject) {

        async.series({

            devicetype: function (cb) {
                devicetypeService.disable(requestObject, cb);
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

/* Validate DeviceType Name */
var validateName = function (req, res) {

    async.parallel({

        serialNumber: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.query.serialNumber, cb)
        },
        customer: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb)
        }
//        accessKey: function (cb) {
//            ReqCS.sessionUsersCustomerAccessKey(req, cb)
//        }

    }, function (err, requestObject) {


        async.series({

            validataion: function (cb) {
                devicetypeService.validateSiteName(requestObject, cb)
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
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            list: function (cb) {
                devicetypeService.list(requestObject, cb);
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
};

var listncount = function (req, res) {
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
            list: function (cb) {
                devicetypeService.list(requestObject, cb);
            },
            count: function (cb) {
                devicetypeService.count(requestObject, cb);
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
};

var count = function (req, res) {
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
            count: function (cb) {
                devicetypeService.count(requestObject, cb);
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
};


var listIdText = function (req, res) {
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
            list: function (cb) {
                devicetypeService.listIdText(requestObject, cb);
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
};

/* ACTIONS */
module.exports = {
    validateName: validateName,
    create: create,
    edit: edit,
    disable: disable,
    list: list,
    count: count,
    listncount: listncount,
    listIdText: listIdText
};
