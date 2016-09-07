/**
 * Created by harinaths on 19/8/14.
 */

var _ = require('underscore');
var async = require('async');
var db = global.db;
var ObjectId = db.ObjectId;
var moment = require('moment');

var validateName = function(requestObject, cb){

    var criteria = {
        condition : {  },
        sort: {  },
        pagination : {skip:0,limit:10},
        requiredFields : {}
    }


    if(!requestObject.name){
        cb("INVALID_NAME", null);
        return;
    }  //TERMINATION POINT



    criteria.condition.name = requestObject.name;
    criteria.condition.site = requestObject.site;
    criteria.condition.accessKey = requestObject.accessKey;
//    console.log("CRITERIA CONDITION : ",criteria.condition)
    db.findOne('zones', criteria, function(err, site){
        if(!err && site){
            cb("ALREADY_EXIST", null)
        }else{
            cb(null, "VALID");
        }
    });

};

/*Create Zone*/
var create = function(requestObject, cb){
//    console.log("inside zone create",requestObject)
    if(requestObject){
        var obj = {
            name : requestObject.name,
            customer : requestObject.customer,
            accessKey : requestObject.accessKey,
            user : requestObject.user,
            meta : requestObject.meta,
            location : requestObject.location,
            site : requestObject.site
        };
//        console.log("zone obj :::::::::::::::::::::::::::::::::::::",obj)
        db.save('zones', obj , cb);
    }else{
        cb("FAILED", null)
    }
}

var edit = function(requestObject, cb){

    if(requestObject && requestObject.zone){
        var obj = {};
        requestObject.name && ( obj.name = requestObject.name);
        requestObject.meta && ( obj.meta = requestObject.meta);
        requestObject.location && ( obj.location = requestObject.location);


        var updateObj = {
            condition : {_id : requestObject.zone},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };


        db.update('zones', updateObj, cb);
    }else{
        cb("INVALID_SITE_ID", null)
    }
}


var disable = function(requestObject, cb){

    if(requestObject && requestObject.zone){
        var obj = {
            disabled : true,
            disabledBy : requestObject.user._id
        };

        var updateObj = {
            condition : {_id : requestObject.zone, customer: requestObject.customer},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };

        db.update('zones', updateObj, cb);
    }else{
        cb("INVALID_ZONE_ID", null)
    }
}

var list = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : {  }
    };


    /* DeviceGateway based Devices*/

    if(!_.isEmpty(requestObject.customerId)){
        criteria.condition.customer = requestObject.customerId
    }

    if(!_.isEmpty(requestObject.site)){
        criteria.condition.site = requestObject.site
    }


    criteria.condition.disabled = {$ne : true}


    /* Paginated Records */

    if(requestObject.pagination && requestObject.pagination.required){
        if(requestObject.pagination.pageNumber && requestObject.pagination.recordsPerPage )
        {
            var limit = parseInt(requestObject.pagination.recordsPerPage) ;
            criteria.pagination['skip'] = (limit * (requestObject.pagination.pageNumber - 1));
            criteria.pagination['limit'] = limit;
        }
        else if( requestObject.pagination.recordsPerPage)
        {
            var limit = parseInt(requestObject.pagination.recordsPerPage) ;
            criteria.pagination['limit'] = limit;

            if(requestObject.pagination.lastRecordId)
            {
                criteria.condition._id = { $lt: db.ObjectId(requestObject.pagination.lastRecordId.toString()) }
            }
        }
    }


    if(!_.isEmpty(requestObject.sort)){
        criteria.sort=requestObject.sort
    }

//    console.log("PAGINATION Request Object : ", requestObject.pagination);
//    console.log("PAGINATION : ", criteria.pagination);
//    console.log("CRITERIA : ", criteria.condition);

    /* DB Query*/
    db.find('zones', criteria, cb);
};

var count = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : {  }
    };



    if(!_.isEmpty(requestObject.customerId)){
        criteria.condition.customer = requestObject.customerId
    }

    if(!_.isEmpty(requestObject.site)){
        criteria.condition.site = requestObject.site
    }

    criteria.condition.disabled = {$ne : true}

    /* DB Query*/
    db.count('zones', criteria, cb);
};

var status = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : {  }
    };


    /* DeviceGateway based Devices*/

    if(!_.isEmpty(requestObject.customerId)){
        criteria.condition.customer = requestObject.customerId
    }

    /* DB Query*/
    db.find('zones', criteria, function(err, sites){

        async.each(sites || [], function(site, sitesIteratorCB){
            async.series({
                eneryYield : function(selfcb){
                    var matchObj = {
                        parameter : 'E-Total',
                        "deviceId" : {$in : ['WRTP4Q75','WRTP4Q8C']},
                        ts : {$gte : moment(requestObject.date).startOf('day')._d , $lte : moment(requestObject.date).endOf('day')._d}
                    };

                    if(requestObject.sites && requestObject.sites.length > 0 ){
                        matchObj.site = {$in : requestObject.sites}
                    }

                    if(requestObject.zones && requestObject.zones.length > 0 ){
                        matchObj.zone = {$in : requestObject.zones}
                    }

                    var criteria = [
                        { $match: matchObj},
                        { $project: { ts:1,deviceId:1, deviceSn:1,site:1,zone:1,gateway:1,yield:{ $subtract: [ '$end', '$start' ] } } },
                        { $group: { _id: {site:"$site", zone:"$zone"}, yield: { $sum: '$yield' } } }
                    ];

                    db.aggregate('days', criteria, function(e, docs){

                        if(!err && docs && docs.length > 0 ){
                            console.log('Energy yield', docs)
                            site["todayyield"] = docs[0]["yield"]
                        }else{
                            site["todayyield"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs );
                    });
                },
                irradiance : function(selfcb){ //IntSolIrr
                    var matchObj = {
                        parameter : 'IntSolIrr',
                        "deviceId" : {$in : ['SENS0802']},
                        ts : {$gte : moment(requestObject.date).startOf('day')._d , $lte : moment(requestObject.date).endOf('day')._d}
                    }

                    if(requestObject.sites && requestObject.sites.length > 0 ){
                        matchObj.site = {$in : requestObject.sites}
                    }

                    if(requestObject.zones && requestObject.zones.length > 0 ){
                        matchObj.zone = {$in : requestObject.zones}
                    }

                    var criteria = [
                        { $match: matchObj},
                        { $group: { _id: {site:"$site", zone:"$zone"}, irradiance: { $sum: '$current' } } }
                    ];

                    db.aggregate('days', criteria, function(e, docs){

                        if(!err && docs && docs.length > 0 ){
                            console.log('Irradiance', docs)
                            site["irradiance"] = docs[0]["irradiance"] || 0
                        }else{
                            site["irradiance"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs );
                    });
                },
                isolation : function(selfcb){
                    var matchObj = {
                        parameter : 'IntSolIrr wh',
                        "deviceId" : {$in : ['SENS0802']},
                        ts : {$gte : moment(requestObject.date).startOf('day')._d , $lte : moment(requestObject.date).endOf('day')._d}
                    }

                    if(requestObject.sites && requestObject.sites.length > 0 ){
                        matchObj.site = {$in : requestObject.sites}
                    }

                    if(requestObject.zones && requestObject.zones.length > 0 ){
                        matchObj.zone = {$in : requestObject.zones}
                    }

                    var criteria = [
                        { $match: matchObj},
                        { $project: { ts:1,deviceId:1, deviceSn:1,site:1,zone:1,gateway:1,yield:{ $subtract: [ '$end', '$start' ] } } },
                        { $group: { _id: {site:"$site", zone:"$zone"}, yield: { $sum: '$yield' } } }
                    ];

                    db.aggregate('days', criteria, function(e, docs){

                        if(!err && docs && docs.length > 0 ){
                            console.log('Isolation', docs)
                            site["IntSolIrrwh"] = docs[0]["yield"] || 0
                        }else{
                            site["IntSolIrrwh"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs );
                    });
                },
                currentGeneration : function(selfcb){
                    var matchObj = {
                        parameter : 'Pac',
                        "deviceId" : {$in : ['WRTP4Q75','WRTP4Q8C']},
                        ts : {$gte : moment(requestObject.date).startOf('day')._d , $lte : moment(requestObject.date).endOf('day')._d}
                    }

                    if(requestObject.sites && requestObject.sites.length > 0 ){
                        matchObj.site = {$in : requestObject.sites}
                    }

                    if(requestObject.zones && requestObject.zones.length > 0 ){
                        matchObj.zone = {$in : requestObject.zones}
                    }

                    var criteria = [
                        { $match: matchObj},
                        { $group: { _id: {site:"$site", zone:"$zone"}, Pac: { $sum: '$current' } } }
                    ];

                    db.aggregate('days', criteria, function(e, docs){

                        if(!err && docs && docs.length){
                            site["Pac"] = docs[0]["Pac"]
                        }else{
                            site["Pac"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs );
                    });
                },
                totalEnergyYield : function(selfcb){

                    var matchObj = {
                        parameter : 'E-Total',
                        "deviceId" : {$in : ['WRTP4Q75','WRTP4Q8C']},
                        ts : {$gte : moment(requestObject.date).startOf('year')._d , $lte : moment(requestObject.date).endOf('year')._d}
                    }

                    if(requestObject.sites && requestObject.sites.length > 0 ){
                        matchObj.site = {$in : requestObject.sites}
                    }

                    if(requestObject.zones && requestObject.zones.length > 0 ){
                        matchObj.zone = {$in : requestObject.zones}
                    }

                    var criteria = [
                        { $match: matchObj},
                        { $project: { ts:1,deviceId:1, deviceSn:1,site:1,zone:1,gateway:1,yield:{ $subtract: [ '$end', '$start' ] } } },
                        { $group: { _id: {site:"$site", zone:"$zone"}, yield: { $sum: '$yield' } } }
                    ];

                    db.aggregate('years', criteria, function(e, docs){

                        if(!err && docs && docs.length){
                            site["totalYield"] = docs[0]["yield"]
                        }else{
                            site["totalYield"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs );
                    });
                },
                weather : function(selfcb) {

                    var matchObj = {
                        parameter : 'TmpAmb C',
                        "deviceId" : {$in : ['SENS0802']},
                        ts : {$gte : moment(requestObject.date).startOf('day')._d , $lte : moment(requestObject.date).endOf('day')._d}
                    }

                    if(requestObject.sites && requestObject.sites.length > 0 ){
                        matchObj.site = {$in : requestObject.sites}
                    }

                    if(requestObject.zones && requestObject.zones.length > 0 ){
                        matchObj.zone = {$in : requestObject.zones}
                    }

                    var criteria = [
                        { $match: matchObj},
                        { $group: { _id: {site:"$site", zone:"$zone"}, weather: { $avg: '$current' } } }
                    ];

                    db.aggregate('days', criteria, function(e, docs){

                        if(!err && docs && docs.length){
                            site["weather"] = docs[0]["weather"]
                        }else{
                            site["weather"] = 0;
                            console.log(err)
                        }
                        selfcb(err, docs );
                    });


                }
            }, function(err, status){
                sitesIteratorCB(null);
            })
        },function(err){

            cb(null, sites);

        } );


    });

};

var listIdText = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : { id:1, name:1 }
    };

    /* List roles created by logged in user*/

    if(!_.isEmpty(requestObject.customerId)){
//        console.log("user._id ",requestObject.user._id )
        criteria.condition.user = requestObject.user._id;
    }

    criteria.condition.disabled = {$ne : true}

    if(!_.isEmpty(requestObject.sort)){
        criteria.sort=requestObject.sort
    }

    /* DB Query*/
    db.find('zones', criteria, cb);
};

/*var newStatus = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { }
    };

    if(!_.isEmpty(requestObject.sites)){
        criteria.condition.site = requestObject.sites
    }


    if(!_.isEmpty(requestObject.zones)){
        criteria.condition._id = {$in: requestObject.zones}
    }

    *//* DB Query*//*
    db.find('zones', criteria, function(err, zones){

        if(!err && zones && zones.length>0){

            var zonesIterator = function(zone, zoneIteratorCB){
                async.series({
                    energyYield : function(selfCB){
                        var matchObj = {
                            "_id.zone":zone._id,
                            "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                        }

                        var criteria = [
                            { $match: matchObj},
                            { $project: {"yield":1 } },
                            { $group: { _id: {zone:"$_id.zone"}, yield: { $sum: '$yield' } } }
                        ];

                        db.aggregate('energyGeneration', criteria, function(err, docs){

                            if(!err && docs && docs.length > 0 ){
                                console.log('Energy Generation:' + JSON.stringify(docs));
                                selfCB(null, docs[0]["yield"])
                            }else{
                                selfCB(err, 0);

                            }

                        });
                    },
                    totalYield : function(selfCB){
                        var matchObj = {
                            "_id.zone":zone._id,
                            "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                        }

                        var criteria = [
                            { $match: matchObj},
                            { $project: {"yield":1 } },
                            { $group: { _id: {zone:"$_id.zone"}, yield: { $sum: '$yield' } } }
                        ];

                        db.aggregate('energyGeneration', criteria, function(err, docs){

                            if(!err && docs && docs.length > 0 ){
                                console.log('Total Energy Generation:' + JSON.stringify(docs));
                                selfCB(null, docs[0]["yield"])
                            }else{
                                selfCB(err, 0);

                            }

                        });
                    },
                    poa : function(selfCB){
                        var matchObj = {
                            "_id.zone":zone._id,
                            "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                        }

                        var criteria = [
                            { $match: matchObj},
                            { $project: {"capacity.value":1, "orientation":1, "energyGenreation":1, "poa":1 }},
                            { $group: { _id: {zone:"$_id.zone", orientation:"$orientation"}, totalCap: { $sum: '$capacity.value' } , totalEnergy:{ $sum: '$energyGenreation' }, totalPoa:{ $sum: '$poa' } } },
                            { $project: {"orientation":'$_id.orientation', "totalCap":1, "totalEnergy":1, "totalPoa":1,_id:0 }}
                        ];

                        db.aggregate('poaGeneration', criteria, function(err, docs){

                            if(!err && docs && docs.length > 0 ){

                                console.log("ZONE ID :",zone._id, docs);


                                  selfCB(err, docs );
                            }else{
//                            site["todayyield"] = 0;
                                selfCB(err, 0 );
                            }

                        });
                    },
                    currentGeneration : function(selfCB){
                        var matchObj = {
                            "_id.zone":zone._id,
                            "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                        }

                        var criteria = [
                            { $match: matchObj},
                            { $project: {"activePower":1}},
                            { $group: { _id: {zone:"$_id.zone"}, activePower: { $sum: '$activePower' } } }
                        ];


                        db.aggregate('activePowerGeneration', criteria, function(e, docs){
                            if(!err && docs && docs.length > 0 ){
                                selfCB(null, docs[0]["activePower"])

                            }else{

                                selfCB(err, 0 );
                            }
                        });
                    },
                    lastReportedTime : function(selfcb) {

                        var criteria = {
                            condition : {
                                parameter : 'invEnergyTotal',
                                "zone":zone._id
                            },
                            sort: { _id : -1  },
                            pagination : {limit:1},
                            requiredFields : {lastReportedTime:1,_id:0}
                        }

                        db.find('days', criteria, function(e, docs){
                            if(!err && docs && docs.length){
                            }else{
                                console.log(err)
                            }
                            selfcb(err, docs );
                        });

                    },
                    alarmCount : function(selfcb) {

                        var criteria = {
                            condition : {
                                "zone":zone._id,
                                "clearedStatus" : "NOT_CLEARED"
                            },
                            sort: {  },
                            pagination : {},
                            requiredFields : {}
                        }

                        db.count('alarm_history', criteria, function(e, docs){
                            if(!err && docs && docs.length){
                            }else{
                                console.log(err)
                            }
                            selfcb(err, docs );
                        });

                    }

                }, function(err, dataObj){
                    _.extend(zone,dataObj);
                    zoneIteratorCB(null)
                })
            }
            async.each(zones || [] , zonesIterator, function(err){
                cb(null, zones);
            });
        }else{
            cb(null, null)
        }
    });
};*/



var newStatus = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { }
    }

    if(!_.isEmpty(requestObject.sites)){
        criteria.condition.site = {$in:requestObject.sites}
    }


    if(!_.isEmpty(requestObject.zones)){
        criteria.condition._id = {$in: requestObject.zones}
    }
    console.log(criteria.condition)
    /* DB Query*/
    db.find('zones', criteria, function(err, zones){

        console.log("zones...........",zones.length,zones)

        if(!err && zones && zones.length>0){

            var zonesIterator = function(zone, zoneIteratorCB){
                async.series({
                    energyYield : function(selfCB){
                        var matchObj = {
                            "_id.zone":zone._id,
                            "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                        }

                        var criteria = [
                            { $match: matchObj},
                            { $project: {"yield":1 } },
                            { $group: { _id: {zone:"$_id.zone"}, yield: { $sum: '$yield' } } }
                        ];

                        db.aggregate('energyGeneration', criteria, function(err, docs){

                            if(!err && docs && docs.length > 0 ){
                                console.log('Energy Generation:' + JSON.stringify(docs));
                                selfCB(null, docs[0]["yield"])
                            }else{
                                selfCB(err, 0);

                            }

                        });
                    },
                    totalYield : function(selfCB){
                        var matchObj = {
                            "_id.zone": zone._id
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
                                        site: "$_id.zone"
                                    },
                                    yield: {
                                        $sum: '$yield'
                                    }
                                }
                            }
                        ];

                        db.aggregate('energyGeneration', criteria, function (err, docs) {
                            if(!err && docs && docs.length > 0 ){

                                //console.log("ZONE YIELD :",zone._id, docs);


                                selfCB(err, docs[0].yield );
                            }else{
                                selfCB(err, 0 );
                            }
                        });

                       /* var criteria = {
                            condition: {},
                            sort: { _id: -1  },
                            pagination: {limit: 1}
                        };

                        if (zone) {
                            criteria.condition.zone = zone._id.toString()
                        }

                        console.log('Criteria', criteria);

                        criteria.requiredFields = {
                            "gridEnergyTotal": 1, "_id": 0
                        };

                        db.find('grid_formatted_logs', criteria, function (err, docs) {

                            console.log("result...................",docs)
                            selfCB(err, docs[0].gridEnergyTotal);
                            //cb(err, docs[0]);
                        });*/
                    },
                    poa : function(selfCB){

                        var criteria = {
                            condition : {zone:zone._id,site:zone.site, typeName : {$in : ['Sensor Box','WSTATION']}},
                            requiredFields : {}
                        }
                        console.log("criteria......",criteria)
                        db.count('devices', criteria, function(err,devices){
                            console.log("dev count : ",devices)
                            if(!err && devices && devices > 0 ){

                                var matchObj = {
                                    "_id.zone":zone._id,
                                    "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                                }

                                var criteria = [
                                    { $match: matchObj},
                                    { $project: {"capacity.value":1, "orientation":1, "energyGenreation":1, "poa":1 }},
                                    { $group: { _id: {zone:"$_id.zone", orientation:"$orientation"}, totalCap: { $sum: '$capacity.value' } , totalEnergy:{ $sum: '$energyGenreation' }, totalPoa:{ $sum: '$poa' } } },
                                    { $project: {"orientation":'$_id.orientation', "totalCap":1, "totalEnergy":1, "totalPoa":1,_id:0 }}
                                ];

                                db.aggregate('poaGeneration', criteria, function(err, docs){

                                    if(!err && docs && docs.length > 0 ){

                                        //console.log("ZONE ID :",zone._id, docs);


                                        selfCB(err, docs );
                                    }else{
                                        selfCB(err, 0 );
                                    }

                                });

                            }else{
                                console.log("its coming to else of zone...........")
                                var criteriaObj = {
                                    'zone' : zone._id,
                                    'site' : zone.site
                                }

                                db.find('wstation_config', criteriaObj, function(err, docs){

                                    console.log("docs.............",docs)
                                    if(!err && docs && docs.length > 0 ){
                                        var matchObj = {
                                            "_id.site":zone.site,
                                            "_id.device":docs[0].device,
                                            "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                                        }

                                        var criteria = [
                                            { $match: matchObj},
                                            { $project: {"capacity.value":1, "orientation":1, "energyGenreation":1, "poa":1 }},
                                            { $group: { _id: {site:"$site", orientation:"$orientation"}, totalCap: { $sum: '$capacity.value' } , totalEnergy:{ $sum: '$energyGenreation' }, totalPoa:{ $sum: '$poa' } } },
                                            { $project: {"orientation":'$_id.orientation', "totalCap":1, "totalEnergy":1, "totalPoa":1,_id:0 }}
                                        ];

                                        db.aggregate('poaGeneration', criteria, function(err, docs){

                                            if(!err && docs && docs.length > 0 ){

                                                console.log("ZONE ID :",zone._id, docs);


                                                selfCB(err, docs );
                                            }else{
                                                selfCB(err, 0 );
                                            }

                                        });


                                    }else{
                                        selfCB(err, 0 );
                                    }

                                })



                            }


                        })

                        /*var matchObj = {
                         "_id.zone":zone._id,
                         "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                         }

                         var criteria = [
                         { $match: matchObj},
                         { $project: {"capacity.value":1, "orientation":1, "energyGenreation":1, "poa":1 }},
                         { $group: { _id: {zone:"$_id.zone", orientation:"$orientation"}, totalCap: { $sum: '$capacity.value' } , totalEnergy:{ $sum: '$energyGenreation' }, totalPoa:{ $sum: '$poa' } } },
                         { $project: {"orientation":'$_id.orientation', "totalCap":1, "totalEnergy":1, "totalPoa":1,_id:0 }}
                         ];

                         db.aggregate('poaGeneration', criteria, function(err, docs){

                         if(!err && docs && docs.length > 0 ){

                         console.log("ZONE ID :",zone._id, docs);


                         selfCB(err, docs );
                         }else{
                         //                            site["todayyield"] = 0;
                         selfCB(err, 0 );
                         }

                         });*/
                    },
                    currentGeneration : function(selfCB){
                        var matchObj = {
                            "_id.zone":zone._id,
                            "_id.ts": {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                        }

                        var criteria = [
                            { $match: matchObj},
                            { $project: {"activePower":1}},
                            { $group: { _id: {zone:"$_id.zone"}, activePower: { $sum: '$activePower' } } }
                        ];


                        db.aggregate('activePowerGeneration', criteria, function(e, docs){
                            if(!err && docs && docs.length > 0 ){
                                selfCB(null, docs[0]["activePower"])

                            }else{

                                selfCB(err, 0 );
                            }
                        });
                    },
                    lastReportedTime : function(selfcb) {

                        var criteria = {
                            condition : {
                                parameter : 'invEnergyTotal',
                                "zone":zone._id
                            },
                            sort: { _id : -1  },
                            pagination : {limit:1},
                            requiredFields : {lastReportedTime:1,_id:0}
                        }

                        db.find('days', criteria, function(e, docs){
                            if(!err && docs && docs.length){
                            }else{
                                console.log(err)
                            }
                            selfcb(err, docs );
                        });

                    },
                    alarmCount : function(selfcb) {

                        var criteria = {
                            condition : {
                                "zone":zone._id,
                                "clearedStatus" : "NOT_CLEARED"
                            },
                            sort: {  },
                            pagination : {},
                            requiredFields : {}
                        }

                        db.count('alarm_history', criteria, function(e, docs){
                            if(!err && docs && docs.length){
                            }else{
                                console.log(err)
                            }
                            selfcb(err, docs );
                        });

                    }

                }, function(err, dataObj){
                    _.extend(zone,dataObj);
                    zoneIteratorCB(null)
                })
            }
            async.each(zones || [] , zonesIterator, function(err){
                cb(null, zones);
            });
        }else{
            cb(null, null)
        }
    });
};

var activePowerForCurrentDay = function(requestObject, cb){
    var deviceCriteria = {
        condition : {zone:requestObject.zones, typeName : 'GMETER'},
        requiredFields : {}
    };

    db.find('devices', deviceCriteria, function(err, devices){

        if(devices && devices.length){
            async.series({

                activePower : function(selfcb) {

                    var matchObj = {
                        _dt : {$gte : requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                    }

                    if(requestObject.sites){
                        matchObj.site =  requestObject.sites.toString()
                    }

                    if(requestObject.zones){
                        matchObj.zone =  requestObject.zones.toString()
                    }

                    var group_id = {};

                    if(requestObject.groupBy == 'hours') {
                        group_id = { _id: {deviceId:"$deviceTypeId", ts:"$_h"}, activePower : { "$avg" : "$invActivePower"}  }
                    }

                    if(requestObject.groupBy == 'days') {
                        group_id = { _id: {deviceId:"$deviceTypeId",ts:"$_d"}, activePower : { "$avg" : "$invActivePower"}  }
                    }


                    if(requestObject.groupBy == 'months') {
                        group_id = { _id: {deviceId:"$deviceTypeId",ts:"$_mo"}, activePower : { "$avg" : "$invActivePower"}  }
                    }

                    if(requestObject.groupBy == 'years') {
                        group_id = { _id: {deviceId:"$deviceTypeId",ts:"$_y"}, activePower : { "$avg" : "$invActivePower"}  }
                    }

                    if(requestObject.groupBy == 'live') {
                        group_id = { _id: {deviceId:"$deviceTypeId",ts:"$_dt"}, activePower : { "$avg" : "$invActivePower"}  }
                    }

                    var criteria = [
                        { $match: matchObj},
                        { $group: group_id},

                        { $project:
                        {   _id: 0,
                            ts: "$_id.ts",
                            deviceId: "$_id.deviceId",
                            activePower: "$activePower"
                        }
                        },
                        { $sort: { "ts": 1 } },
                        { $group: { _id: {deviceId:"$deviceId"}, data : { "$push" : {ts : '$ts', 'activePower' : '$activePower'}}  } },
                        { $project: {_id:0, deviceSn : '$_id.deviceId', values : '$data'}}
                    ]

                    db.aggregate('inv_formatted_logs', criteria, function(err, docs){

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
        }else{
            async.series({
                activePower : function(selfcb) {

                    var matchObj = {
                        ts : {$gte : requestObject.dateRange.from , $lte : requestObject.dateRange.to},
                        deviceSn : {$nin : ["35317", "37305", "37399", "37308", "37327", "37401", "37304", "37317"]}
                    }

                    if(requestObject.sites){
                        matchObj.site =  requestObject.sites
                    }

                    if(requestObject.zones){
                        matchObj.zone =  requestObject.zones
                    }

                    console.log('Match Object');
                    console.log(JSON.stringify(matchObj));

                    var group_id = {};

                    if(requestObject.groupBy == 'hours') {
                        group_id = { _id: {deviceId:"$deviceSn", ts:"$_h"}, activePower : { "$avg" : "$invActivePower"}  }
                    }

                    if(requestObject.groupBy == 'days') {
                        group_id = { _id: {deviceId:"$deviceSn",ts:"$_d"}, activePower : { "$avg" : "$invActivePower"}  }
                    }


                    if(requestObject.groupBy == 'months') {
                        group_id = { _id: {deviceId:"$deviceSn",ts:"$_mo"}, activePower : { "$avg" : "$invActivePower"}  }
                    }

                    if(requestObject.groupBy == 'years') {
                        group_id = { _id: {deviceId:"$deviceSn",ts:"$_y"}, activePower : { "$avg" : "$invActivePower"}  }
                    }

                    if(requestObject.groupBy == 'live') {
                        group_id = { _id: {deviceId:"$deviceSn",ts:"$_mi"}, activePower : { "$avg" : "$invActivePower"}  }
                    }

                    var criteria = [
                        { $match: matchObj},
                        { $group: group_id},

                        { $project:
                        {   _id: 0,
                            ts: "$_id.ts",
                            deviceId: "$_id.deviceId",
                            activePower: "$activePower"
                        }
                        },
                        { $sort: { "ts": 1 } },
                        { $group: { _id: {deviceId:"$deviceId"}, data : { "$push" : {ts : '$ts', 'activePower' : '$activePower'}}  } },
                        { $project: {_id:0, deviceSn : '$_id.deviceId', values : '$data'}}
                    ]

                    db.aggregate('message_history', criteria, function(err, docs){

                        if(!err && docs && docs.length){

                            //console.log(docs)
                        }else{
                            console.log(err)
                        }
                        selfcb(err, docs );
                    });

                }

            },function(err,data){
                cb(err, data)
            })
        }
    });
};


var plantYield = function(requestObject, cb){
    try{
        async.series({
            plantYield : function(selfcb) {
                var matchObj = {
                  "_id.zone":requestObject.zones,
                  "_id.ts" : {"$gte":requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                }

                var group_id = {};
                var project_id = {};

                if(requestObject.groupBy == 'hours') {
                    group_id = { _id: {ts : '$_id._h', zone:"$_id.zone"}, yield: {$sum:"$yield"}},
                    project_id = {"_id._h":1,"_id.site":1,"_id.zone":1, "yield": 1  }
//                    group_id = { _id: {deviceId:"$deviceSn", ts:"$_h"}, activePower : { "$avg" : "$invActivePower"}  }
                }

                if(requestObject.groupBy == 'days') {
                    group_id = { _id: {ts : '$_id._d', zone:"$_id.zone"}, yield: {$sum:"$yield"}}
                    project_id = {"_id._d":1,"_id.site":1,"_id.zone":1, "yield": 1  }
//                    group_id = { _id: {deviceId:"$deviceSn",ts:"$_d"}, activePower : { "$avg" : "$invActivePower"}  }
                }


                if(requestObject.groupBy == 'months') {
                    group_id = { _id: {ts : '$_id._mo', zone:"$_id.zone"}, yield: {$sum:"$yield"}}
                    project_id = {"_id._mo":1,"_id.site":1,"_id.zone":1, "yield": 1  }
//                    group_id = { _id: {deviceId:"$deviceSn",ts:"$_mo"}, activePower : { "$avg" : "$invActivePower"}  }
                }

                if(requestObject.groupBy == 'years') {
                    group_id = { _id: {ts : '$_id._y', zone:"$_id.zone"}, yield: {$sum:"$yield"}}
                    project_id = {"_id._y":1,"_id.site":1,"_id.zone":1, "yield": 1  }
//                    group_id = { _id: {deviceId:"$deviceSn",ts:"$_y"}, activePower : { "$avg" : "$invActivePower"}  }
                }

                if(requestObject.groupBy == 'live') {
                    group_id = { _id: {ts : '$_id._dt', zone:"$_id.zone"}, yield: {$sum:"$yield"}}
                    project_id = {"_id._dt":1,"_id.site":1,"_id.zone":1, "yield": 1  }
//                    group_id = { _id: {deviceId:"$deviceSn",ts:"$_mi"}, activePower : { "$avg" : "$invActivePower"}  }
                }


                var criteria = [
                    { $match: matchObj},
                    { $project : project_id},
//                    { $project: {"_id._h":1,"_id.site":1,"_id.zone":1, "yield": 1  }},
                    { $group: group_id},
//                    { $group: { _id: {ts : '$_id._h', zone:"$_id.zone"}, yield: {$sum:"$yield"}} },
                    { $sort: { "_id.zone":1, "_id.ts": 1 } }
                ];

                db.aggregate('energyGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {
                    } else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });
            }
        },function(err,data){

            cb(err, data)
        })
    }catch(e){
        console.log(e)
    }
}


var parameters = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : {  }
    };


    /* DeviceGateway based Devices*/

    if(!_.isEmpty(requestObject.customerId)){
        criteria.condition.customer = requestObject.customerId
    }

    var params_list = ["gridActivePower", "gridApparentPower", "gridReactivePower",
        "GridMs_A_phsA", "GridMs_A_phsB", "GridMs_A_phsC",
        "GridMs_PhV_phsA", "GridMs_PhV_phsB",	"GridMs_PhV_phsC",
        "GridMs_VA_phsA", "GridMs_VA_phsB", "GridMs_VA_phsC",
        "GridMs_VAr_phsA", "GridMs_VAr_phsB", "GridMs_VAr_phsC",
        "GridMs_W_phsA", "GridMs_W_phsB", "GridMs_W_phsC",
        "GridMs_Hz", "GridMs_TotPFPrc"];

    var parameters = [];
    async.each(params_list || [], function (parameter, sitesIteratorCB) {

        async.series({
            param_value: function (selfcb) {
                var matchObj = {
                    "parameter": parameter,
                    ts: {$gte: moment().startOf('day')._d, $lte: moment().endOf('day')._d}
                }

                if(requestObject.sites){
                    matchObj.site = requestObject.sites;
                }

                if(requestObject.zones){
                    matchObj.zone = requestObject.zones;
                }


                var criteria = {
                    condition: matchObj,
                    sort: {_id: -1}
                };

                db.findOne('hours', criteria, function (err, docs) {
                    selfcb(err, docs)
                });
            }
        }, function (err, data) {
            var param_each = {};
            console.log('Data from parameters', data);
            if(data && data.param_value != null) {
                param_each['parameter'] = data.param_value.parameter;
                param_each['value'] = data.param_value.current;
            }

            parameters.push(param_each);
//            console.log(err, data);
            sitesIteratorCB(null);
        })

    }, function(err){
//        cb(err, split(parameters, 6));
        cb(err, parameters);
    });
};


var zoneAggregatePR = function(requestObject, cb){
    try{
        async.series({
            poaEnergy : function(selfcb) {
                var matchObj = {
                    "_id.site": {$in: requestObject.sites},
                    "_id.ts" : {$gte : requestObject.dateRange.from, $lte : requestObject.dateRange.to}
                }

                var project_id = {};
                var group_id = {};
                if(requestObject.groupBy == 'hours')        {
                    project_id = {"_id._h":1,"_id.site":1, "energyGenreation": 1, "poa": 1  };
                    group_id = { _id: {ts : '$_id._h',site: "$_id.site"},  totalPoa: { $sum: '$poa' } }
                }

                else if(requestObject.groupBy == 'days')        {
                    project_id = {"_id._d":1,"_id.site":1,"energyGenreation": 1, "poa": 1  };
                    group_id = { _id: {ts : '$_id._d',site: "$_id.site"}, totalPoa: { $sum: '$poa' } }
                }

                else if(requestObject.groupBy == 'months')        {
                    project_id = {"_id._mo":1,"_id.site":1,"energyGenreation": 1, "poa": 1  };
                    group_id = { _id: {ts : '$_id._mo',site: "$_id.site"}, totalPoa: { $sum: '$poa' } }
                }

                else if(requestObject.groupBy == 'years')        {
                    project_id = {"_id._y":1,"_id.site":1,"energyGenreation": 1, "poa": 1  };
                    group_id = { _id: {ts : '$_id._y',site: "$_id.site"}, totalPoa: { $sum: '$poa' } }
                }

                console.log(matchObj)
                var criteria = [
                    { $match: matchObj},
                    { $project: project_id},
                    { $group: group_id},
                    { $sort: { "_id.ts": 1 } }
                ];

                db.aggregate('poaGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {
                    } else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });
            },

            plantYield : function(selfcb) {
                var matchObj = {
                    "_id.zone": {$in: requestObject.zones},
                    "_id.ts" : {$gte : requestObject.dateRange.from, $lte : requestObject.dateRange.to}
                }

                var project_id = {};
                var group_id = {};
                if(requestObject.groupBy == 'hours')        {
                    project_id = {"_id._h":1,"_id.site":1,"_id.zone":1,"yield": 1  };
                    group_id = { _id: {ts : '$_id._h',site: "$_id.site",zone: "$_id.zone"}, yield: {$sum:"$yield"}}
                }

                else if(requestObject.groupBy == 'days')        {
                    project_id = {"_id._d":1,"_id.site":1,"_id.zone":1,"yield": 1  };
                    group_id = { _id: {ts : '$_id._d',site: "$_id.site",zone: "$_id.zone"}, yield: {$sum:"$yield"}}
                }

                else if(requestObject.groupBy == 'months')        {
                    project_id = {"_id._mo":1,"_id.site":1,"_id.zone":1,"yield": 1  };
                    group_id = { _id: {ts : '$_id._mo',site: "$_id.site",zone: "$_id.zone"}, yield: {$sum:"$yield"}}
                }

                else if(requestObject.groupBy == 'years')        {
                    project_id = {"_id._y":1,"_id.site":1,"_id.zone":1,"yield": 1  };
                    group_id = { _id: {ts : '$_id._y',site: "$_id.site",zone: "$_id.zone"}, yield: {$sum:"$yield"}}
                }

                console.log(matchObj)
                var criteria = [
                    { $match: matchObj},
                    { $project: project_id},
                    { $group: group_id},
                    { $sort: { "_id.ts": 1 } }
                ];

                db.aggregate('energyGeneration', criteria, function (e, docs) {

                    if (!e && docs && docs.length > 0) {
                    } else {

                        console.log(e)
                    }
                    selfcb(e, docs);
                });
            }
        },function(err,data){

            cb(err, data)
        })
    }catch(e){
        console.log(e)
    }
}


var zonePeakPower = function(requestObject, cb){

    //console.log("REQ OBJ : ",requestObject)

    try{
        async.series({
            peakPower : function(selfcb) {
                var matchObj = {
                    _dt : {$gte : requestObject.dateRange.from , $lte : requestObject.dateRange.to}
                }

                if(requestObject.sites){
                    matchObj.site =  requestObject.sites.toString()
                }

                if(requestObject.zones && requestObject.zones.length > 0){
                    matchObj.zone =  requestObject.zones.toString()
                }

                var group_id = {};

                if(requestObject.groupBy == 'hours') {
                    group_id = { _id: {site :"$site",zone:"$zone"}, activePower : { "$max" : "$gridActivePower"}  }
                }

                if(requestObject.groupBy == 'days') {
                    group_id = { _id: {site :"$site",zone:"$zone"}, activePower : { "$max" : "$gridActivePower"}  }
                }


                if(requestObject.groupBy == 'months') {
                    group_id = { _id: {site :"$site",zone:"$zone"}, activePower : { "$max" : "$gridActivePower"}  }
                }

                if(requestObject.groupBy == 'years') {
                    group_id = { _id: {site :"$site",zone:"$zone"}, activePower : { "$max" : "$gridActivePower"}  }
                }

                if(requestObject.groupBy == 'live') {
                    group_id = { _id: {site :"$site",zone:"$zone"}, activePower : { "$max" : "$gridActivePower"}  }
                }

                var criteria = [
                    { $match: matchObj},
                    { $group: group_id},

                    { $project:
                    {   _id: 0,
                        ts: "$_id.ts",
                        zone: "$_id.zone",
                        site: "$_id.site",
                        activePower: "$activePower"
                    }
                    },
                    { $sort: { "ts": 1 } },
                    { $group: { _id: {zone:"$zone"}, data : { "$push" : {ts : '$ts', 'activePower' : '$activePower'}}  } },
                    { $project: {_id:0, zone : '$_id.zone', values : '$data'}}
                ]


                db.aggregate('grid_formatted_logs', criteria, function(err, docs){

                    if(!err && docs && docs.length){
                        async.eachSeries(docs || [], function (zoneData, zoneIteratorCB) {

                            findSiteName(zoneData, zoneIteratorCB)

                        }, function (err, res) {
                            selfcb(err, docs );
                        })
                    }else{
                        selfcb(err, docs );
                        console.log(err)
                    }

                });
            }

        },function(err,data){

            cb(err, data)
        })
    }catch(e){
        console.log(e)
    }
}

var findSiteName = function(msg,callback){


    try{

        async.parallel({

            /*siteName : function(cb){
                var criteria = {
                    condition : {
                        '_id' : db.ObjectId(msg.site)
                    }
                }
                console.log("Alarm Msg criteria : ",criteria)

                db.findOne('sites',criteria, function(err, data) {
                    if( data && data != ""){
                        msg.siteName = data.name;
                        cb(null,msg)
                    }else{
                        console.log("site name not available")
                        cb()
                    }
                })
            },*/
            zoneName : function(cb){

                if(msg.zone){
                    var criteria = {
                        condition : {
                            '_id' : db.ObjectId(msg.zone)
                        }
                    }
                    //console.log("Alarm Msg criteria : ",criteria)

                    db.findOne('zones',criteria, function(err, data) {
                        if( data && data != ""){
                            msg.zoneName = data.name;
                            msg.capacity = data.meta.capacity.value
                            cb(null,msg)
                        }else{
                            msg.zoneName = "-"
                            msg.capacity = "-"
                            console.log("zone name not available")
                            cb(null,msg)
                        }
                    })
                }else{
                    msg.zoneName = "-"
                    msg.capacity = "-"
                    cb(null,msg)
                }


            }
        },function(err,data){
            callback()
        });

    }catch(e){
        callback()
        console.log("Exception occurred in getting site and zone...",e)
    }



}




function split(a, n) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i + size));
        i += size;
    }
    return out;
}


module.exports = {
    validateName : validateName,
    create : create,
    edit : edit,
    disable : disable,
    list : list,
    status : status,
    count : count,
    listIdText : listIdText,
    newStatus : newStatus,
    parameters : parameters,
    plantYield : plantYield,
    activePowerForCurrentDay: activePowerForCurrentDay,
    zoneAggregatePR : zoneAggregatePR,
    zonePeakPower : zonePeakPower
}