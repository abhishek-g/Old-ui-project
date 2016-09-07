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
    criteria.condition.devicegateway = requestObject.devicegateway;

    db.findOne('devices', criteria, function(err, devicegateway){
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
            serialNum : requestObject.serialNum,
            deviceType : requestObject.deviceType,
            brandName : requestObject.brandName,
            model : requestObject.model,
            site : requestObject.site,
            zone : requestObject.zone,
            meta : requestObject.meta,
            customer : requestObject.customerId,
            accessKey : requestObject.accessKey,
            user : requestObject.user._id,
            devicegateway : requestObject.devicegateway,
            deviceTypeName : requestObject.deviceTypeSerialNumber
        };
        db.save('devices', obj , cb);
    }else{
        cb("FAILED", null)
    }
}

var edit = function(requestObject, cb){

    if(requestObject && requestObject.device){
        var obj = {};
        requestObject.name && ( obj.name = requestObject.name);
        requestObject.meta && ( obj.meta = requestObject.meta);


        var updateObj = {
            condition : {_id : requestObject.device},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };


        db.update('devices', updateObj, cb);
    }else{
        cb("INVALID_DEVICEGATEWAY_ID", null)
    }
}


var disable = function(requestObject, cb){

    if(requestObject && requestObject.device){
        var obj = {
            disabled : true,
            disabledBy : requestObject.user._id
        };

        var updateObj = {
            condition : {_id : requestObject.device},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };

        db.update('devices', updateObj, cb);
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


    /* DEVICEGATEWAY based Devices*/

    if(!_.isEmpty(requestObject.customerId)){
        criteria.condition.customer = requestObject.customerId
    }

    if(!_.isEmpty(requestObject.site)){
        criteria.condition.site = requestObject.site
    }

    if(!_.isEmpty(requestObject.zone)){
        criteria.condition.zone = requestObject.zone
    }

    if(!_.isEmpty(requestObject.devicegateway)){
        criteria.condition.devicegateway = requestObject.devicegateway
    }

    if(!_.isEmpty(requestObject.deviceType)){
        criteria.condition.deviceType = requestObject.deviceType
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
    db.find('devices', criteria, cb);
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

    if(!_.isEmpty(requestObject.devicegateway)){
        criteria.condition.devicegateway = requestObject.devicegateway
    }

    if(!_.isEmpty(requestObject.deviceType)){
        criteria.condition.deviceType = requestObject.deviceType
    }

    criteria.condition.disabled = {$ne : true}

    /* DB Query*/
    db.count('devices', criteria, cb);
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
//        console.log("user._id ",requestObject.user._id );
        criteria.condition.customer = requestObject.user.customer;
    }

    criteria.condition.disabled = {$ne : true};

    if(!_.isEmpty(requestObject.sort)){
        criteria.sort=requestObject.sort;
    }

    /* DB Query*/
    db.find('devices', criteria, cb);
};


module.exports = {
    validateName : validateName,
    create : create,
    edit : edit,
    disable : disable,
    list : list,
    count : count,
    listIdText : listIdText
}