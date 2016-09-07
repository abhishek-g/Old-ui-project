/**
 * Created by harinaths on 19/8/14.
 */

var _ = require('underscore');
var async = require('async');
var db = global.db;
var ObjectId = db.ObjectId;

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
    criteria.condition.zone = requestObject.zone;

//    console.log("CRITERIA CONDITION : ",criteria.condition)
    db.findOne('devicegateways', criteria, function(err, devicegateway){
        if(!err && devicegateway){
            cb("ALREADY_EXIST", null)
        }else{
            cb(null, "VALID");
        }
    });

};

/*Create Site*/
var create = function(requestObject, cb){

    if(requestObject && requestObject.name && requestObject.user ){
        var obj = {
            name : requestObject.name,
            customer : requestObject.customerId,
            accessKey : requestObject.accessKey,
            user : requestObject.user._id,
            meta : requestObject.meta,
            site : requestObject.site,
            zone : requestObject.zone
        };
        db.save('devicegateways', obj , cb);
    }else{
        cb("FAILED", null)
    }
}

var edit = function(requestObject, cb){

    if(requestObject && requestObject.devicegateway){
        var obj = {};
        requestObject.name && ( obj.name = requestObject.name);
        requestObject.meta && ( obj.meta = requestObject.meta);


        var updateObj = {
            condition : {_id : requestObject.devicegateway},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };


        db.update('devicegateways', updateObj, cb);
    }else{
        cb("INVALID_DEVICEGATEWAY_ID", null)
    }
}


var disable = function(requestObject, cb){

    if(requestObject && requestObject.devicegateway){
        var obj = {
            disabled : true,
            disabledBy : requestObject.user._id
        };

        var updateObj = {
            condition : {_id : requestObject.devicegateway},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };

        db.update('devicegateways', updateObj, cb);
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


    /* devicegateway based Devices*/

    if(!_.isEmpty(requestObject.customerId)){
        criteria.condition.customer = requestObject.customerId
    }

    if(!_.isEmpty(requestObject.site)){
        criteria.condition.site = requestObject.site
    }

    if(!_.isEmpty(requestObject.zone)){
        criteria.condition.zone = requestObject.zone
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
    db.find('devicegateways', criteria, cb);
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

    if(!_.isEmpty(requestObject.zone)){
        criteria.condition.zone = requestObject.zone
    }

    criteria.condition.disabled = {$ne : true}

    /* DB Query*/
    db.count('devicegateways', criteria, cb);
};



module.exports = {
    validateName : validateName,
    create : create,
    edit : edit,
    disable : disable,
    list : list,
    count : count
}