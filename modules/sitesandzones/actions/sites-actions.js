/**
 * Created by harinaths on 19/8/14.
 */


/* Supporting Node Modules */
var async = require('async');
var _ = require('underscore');


/* System Modules */
var ReqCS = require(global.root+'/modules/global/helpers/request-object-construction-service');
var ResCS = require(global.root+'/modules/global/helpers/response-object-construction-service');
var siteService = require('./../services/sites-service');
var zoneService = require('./../services/zones-service');


/* Create Actions */
var create = function(req, res){
    var siteInfo;
    var numberOfZonesInserted = 0;
    var zonesObj = Object(req.body.zones)
//    console.log("Inside site-action's create function ")
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
        zones : function(cb){
            ReqCS.setPassedArguments(req.body.zones, cb);
        }
    }, function(err, requestObject){
//         console.log("before waterfall............................................")
         async.waterfall([
         function (cb) {
         siteService.create(requestObject, //cb)
             function (err, data) {
                 siteInfo = data;
//                 console.log("getting site id............................................", siteInfo)
                 cb();
             }
         )
         },
         function (cb) {
             if(0 < (Object.keys((zonesObj))).length) {
             async.forEach(Object.keys((zonesObj)), function (item, callback) {
                     async.series({
                         zonename: function (cb) {
                             ReqCS.setPassedArgumentsStrict(zonesObj[item].zonename, cb);
                         },
                         zonelocation: function (cb) {
                             ReqCS.setPassedArgumentsStrict(zonesObj[item].location, cb);
                         },
                         zonemeta: function (cb) {
                             ReqCS.setPassedArgumentsStrict(zonesObj[item].meta, cb);
                         }                         ,
                         siteInfo : function(cb){
//                             console.log("getting site id in function siteid............................................",siteInfo)
                             ReqCS.setPassedArgumentsStrict(siteInfo, cb);
                         }
                     }, function (err, requestObject) {
//                         console.log("before calling zone create function; request object : ", requestObject)
                         zoneService.create(requestObject, //cb)
                             function(err, data){
                                 numberOfZonesInserted++;
//                                 console.log("numberOfZonesInserted......................", numberOfZonesInserted)
//                                 console.log("any error?......................", err, data)
                                 callback();
                             })
                     })
                 }, function(err,data) {
//                     console.log('iterating done in site-action create()',err,data);
                     cb(null,numberOfZonesInserted);
                 })
             }
             else{
//                 console.log('no zones created ');
                 cb(null,numberOfZonesInserted);
             }
         }
     ], function (err,data, _object) {
//        console.log("data after waterfall execution.................",err, data);
//         function (err, _object) {
//             console.log("in function (err, _object) {.................",err, _object);
             var response = {
                 status: err ? 400 : 200,
                 data: err || "CREATED"
             }
             res.send(response);
//         };
     });
    });
    };


var create2 = function(req, res){
    var siteId;
    var numberOfZonesInserted = 0
    var zonesObj = Object(req.body.zones)
//console.log("Inside site-action's create function ")
    async.parallel({
        sitename: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.body.sitename, cb);
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
        zones : function(cb){
            ReqCS.setPassedArguments(req.body.zones, cb);
        }
    }, function(err, requestObject){
//        console.log("Inside site-action's create function; request object ", requestObject)
//
//            siteService.create(requestObject, //cb);
//       function(err, data){
//         siteId = data._id;
//           cb();
//       })
//        console.log("siteId    siteIdsiteIdsiteIdsiteIdsiteIdsiteIdsiteIdsiteIdsiteIdsiteIdsiteId ", siteId)
        async.series({
            siteId: function (cb) {
                siteService.create(requestObject, //cb)
                    function(err,data){
//                        console.log("getting site id............................................",data._id)
                        siteId=data;
//                        console.log("getting site id............................................",siteId)
                        cb();
                })
            }
        }, function (err, requestObject) {
//            console.log("getting site id3............................................",requestObject)
            async.series({
                createZone: function (cb) {
//                    console.log("getting site id4............................................",requestObject)
                if(0 < (Object.keys((zonesObj))).length) {
                    async.forEach(Object.keys((zonesObj)), function (item, cb) {
//                        console.log("keys...........................",zonesObj[item])
//                        console.log("keys.zonename..json parsed........................",zonesObj[item].zonename)
                        async.series({
                            zonename: function (cb) {
                                ReqCS.setPassedArgumentsStrict(zonesObj[item].zonename, cb);
                            },
                            zonelocation: function (cb) {
                                ReqCS.setPassedArgumentsStrict(zonesObj[item].location, cb);
                            },
                            zonemeta: function (cb) {
                                ReqCS.setPassedArgumentsStrict(zonesObj[item].meta, cb);
                            }
                            ,
                            siteId : function(cb){
//                                console.log("getting site id in function siteid............................................",siteId)
                                ReqCS.setPassedArgumentsStrict(siteId, cb);
                            }
                        }, function (err, requestObject) {
//                            console.log("before calling zone create function; request object : ", requestObject)
                            zoneService.create(requestObject, //cb)
                                function(err, data){
                                    numberOfZonesInserted+=arguments.n;
//                                    console.log("numberOfZonesInserted......................", numberOfZonesInserted)
//                                    console.log("any error?......................", err, data)
                                })
                            cb();
                        })
                    }, function(err,data) {
                        console.log('iterating done',err,data);
                        cb(null,numberOfZonesInserted);
                    })
                }
            }
            }, function (err, _object) {
                var response = {
                    status: err ? 400 : 200,
                    data: err || "CREATED"
                }
                res.send(response);
            });
        })
//            ,
//            createZone: function (cb) {
//                if(0 < (Object.keys(requestObject.zones)).length) {
//                    async.forEach(Object.keys(requestObject.zones), function (item, callback) {
//                        console.log("keys...........................",requestObject.zones[item])
//                        console.log("keys.zonename..json parsed........................",requestObject.zones[item].zonename)
//                        async.parallel({
//                            zonename: function (CB) {
//                                ReqCS.setPassedArgumentsStrict(requestObject.zones[item].zonename, CB);
//                            },
//                            zonelocation: function (CB) {
//                                ReqCS.setPassedArgumentsStrict(requestObject.zones[item].location, CB);
//                            },
//                            zonemeta: function (CB) {
//                                ReqCS.setPassedArgumentsStrict(requestObject.zones[item].meta, CB);
//                            }
//                            ,
//                            user : function(CB){
//                                ReqCS.setPassedArgumentsStrict(requestObject.zones[item].user, CB);
//                            },
//                            siteid : function(CB){
//                                ReqCS.setPassedArgumentsStrict(siteId, CB);
//                            }
//                        }, function (err, requestObject) {
//                            console.log("before calling zone create function; request object : ", requestObject)
//                            zoneService.create(requestObject, //cb)
//                                function(err, data){
//                                    console.log("any error?......................", err, data)
//                                })
//                        })
//                        callback();
//                    })
//                }
//            }
//            ,
//            createZone: function (cb) {
//                console.log("siteId ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ", requestObject.siteId)
//                console.log("requestObject.zones?????????????????????????????????????????????????????/ : ", requestObject.zones)
//            var keys = Object.keys(requestObject.zones);
//                console.log("keys : ", keys)
//            async.forEach(keys, function (item, cb) {
//                async.parallel({
//                    zonename: function (cb) {
//                        ReqCS.setPassedArgumentsStrict(req.body.zones[item].zonename, cb);
//                    },
//                    zonelocation: function (cb) {
//                        ReqCS.setPassedArgumentsStrict(req.body.zones[item].location, cb);
//                    },
//                    zonemeta: function (cb) {
//                        ReqCS.setPassedArgumentsStrict(req.body.zones.meta[item], cb);
//                    }
//                }, function (err, requestObject) {
//                    console.log("before calling zone create function; request object : ",requestObject)
//                    zoneService.create(requestObject, cb)
//                })
//            })
//            }
//        }, function (err, site) {
//            async.series({
//            createZone: function (createSite,cb) {
//                var keys = Object.keys(req.body.zones);
//                async.forEach(keys, function (item, callback) {
//                    zoneService.create(site,req.body.zones, cb)
//                })
//            }


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
        siteId : function(cb){
            ReqCS.getObjectId(req.body.siteId, cb);
        }
    }, function(err, requestObject){

        async.series({

            site: function (cb) {
                siteService.edit(requestObject, cb);
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
        siteId : function(cb){
            ReqCS.getObjectId(req.body.siteId, cb);
        }
    }, function(err, requestObject){

        async.series({

            site: function (cb) {
                siteService.disable(requestObject, cb);
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

/* Validate Site Name */
var validateSiteName = function (req, res) {

    async.parallel({

        name: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.query.name, cb)
        },
        customer: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb)
        }
//        ,
//        accessKey: function (cb) {
//            ReqCS.sessionUsersCustomerAccessKey(req, cb)
//        }

    }, function (err, requestObject) {



            async.series({

                validataion: function (cb) {
                    siteService.validateSiteName(requestObject, cb)
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
        }

    }, function (err, requestObject) {

        async.parallel({
            list : function(cb) {
                siteService.list(requestObject, cb);
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
        }

    }, function (err, requestObject) {

        async.parallel({
            list : function(cb) {
                siteService.list(requestObject, cb);
            },
            count : function(cb) {
                siteService.count(requestObject, cb);
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
                siteService.count(requestObject, cb);
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

var mapred = function(req, res) {
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
                siteService.mapred(requestObject, cb);
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
                siteService.listIdText(requestObject, cb);
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
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.date, cb);
        }

    }, function (err, requestObject) {
        async.parallel({
            data : function(cb) {
                siteService.status(requestObject, cb);
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

var allstatus = function(req, res){
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
                siteService.allstatus(requestObject, cb);
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


var weather = function(req, res){
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
            ReqCS.getAsObjectIds(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getAsObjectIds(req.body.zones, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            weather: function (cb) {
                siteService.weather(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.weather
            }
            res.send(response);

        })
    });
};

var pr = function(req, res){
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
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.dateRange, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }


    }, function (err, requestObject) {

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(requestObject);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@");

        async.parallel({
            data: function (cb) {
                siteService.pr(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data

            }
            res.send(response);

        })
    });
};

var energy = function(req, res){
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
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.dateRange, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            energyYield: function (cb) {
                siteService.energy(requestObject, cb);
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
        sites: function (cb) {
            ReqCS.getObjectId(req.body.sites, cb);
        },
        zones: function (cb) {
            ReqCS.getAsObjectIds(req.body.zones, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                siteService.activePowerForCurrentDay(requestObject, cb);
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


var activePowerVSPoa = function(req, res){
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
        zones: function (cb) {
            ReqCS.getAsObjectIds(req.body.zones, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                siteService.activePowerVSPoa(requestObject, cb);
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

var activePowerVSPoaForHistory = function(req, res){
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
        dateRange : function(cb){
            ReqCS.getDateRange(req.body.dateRange, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy || 'days', cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            activePowerVSPoa: function (cb) {
                siteService.activeVSpoa(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data

            }
            res.send(response);

        })
    });
};

var hierarchy = function(req, res){
    async.parallel({
        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        sites : function(cb){
            ReqCS.getUserSites(req, cb)
        }
    },function (err, requestObject) {


        async.parallel({
            sites: function (cb) {
                siteService.getHierarchy(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data

            }
            res.send(response);

        })
    });
};

var acVSPoa = function(req, res){
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
            ReqCS.getAsObjectIds(req.body.sites, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy, cb);
        }
    }, function (err, requestObject) {

        async.parallel({
            activePower: function (cb) {
                siteService.acVSPoa(requestObject, cb);
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

var zonePR = function(req, res){

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
        zones: function (cb) {
            ReqCS.getAsObjectIds(req.body.zones, cb);
        }

    }, function (err, requestObject) {


        async.parallel({
            activePower: function (cb) {
                siteService.zonePR(requestObject, cb);
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

var devicePR = function(req, res){

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
        zones: function (cb) {
            ReqCS.getObjectId(req.body.zones, cb);
        }

    }, function (err, requestObject) {


        async.parallel({
            activePower: function (cb) {
                siteService.devicePR(requestObject, cb);
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
                siteService.plantYield(requestObject, cb);
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


var specificPower = function(req, res){
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
            ReqCS.getAsObjectIds(req.body.sites, cb);
        },
        groupBy: function (cb) {
            ReqCS.setPassedArguments(req.body.groupBy, cb);
        }
    }, function (err, requestObject) {
        async.parallel({
            activePower: function (cb) {
                siteService.specificPower(requestObject, cb);
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


var siteSummary = function(req, res){
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
            summary: function (cb) {
                siteService.siteSummary(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.summary

            }
            res.send(response);

        })
    });
};



var siteAggregatePR = function(req, res){
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
                siteService.siteAggregatePR(requestObject, cb);
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
    validateSiteName : validateSiteName,
    create : create,
    edit : edit,
    disable : disable,
    list : list,
    count : count,
    listncount : listncount,
    mapred : mapred,
    listIdText : listIdText,
    status : status,
    allstatus : allstatus,
    weather : weather,
    pr : pr,
    energy : energy,
    activePowerTrend : activePowerTrend,
    activePowerVSPoa : activePowerVSPoa,
    activePowerVSPoaForHistory : activePowerVSPoaForHistory,
    hierarchy : hierarchy,
    acVSPoa : acVSPoa,
    zonePR : zonePR,
    devicePR : devicePR,
    plantYield : plantYield,
    specificPower:specificPower,
    siteSummary:siteSummary,
    siteAggregatePR : siteAggregatePR
};
