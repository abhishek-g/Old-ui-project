/**
 * Created by harinaths on 19/8/14.
 */

var _ = require('underscore');
var async = require('async');
var db = global.db;
var ObjectId = db.ObjectId;

var validateSiteName = function(requestObject, cb){

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


    criteria.condition.serialNumber = requestObject.serialNumber;
    criteria.condition.customer = requestObject.customer;

//    console.log("DEVICETYPE VALIDATION CRITERIA ", criteria.condition)

    db.findOne('devicetypes', criteria, function(err, site){
        if(!err && site){
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
            serialNumber : requestObject.serialNumber,
            site : requestObject.site,
            zone : requestObject.zone,
            customer : requestObject.customerId,
            accessKey : requestObject.accessKey,
            user : requestObject.user._id
        };
        db.save('devicetypes', obj , cb);
    }else{
        cb("FAILED", null)
    }
};

var edit = function(requestObject, cb){

    if(requestObject && requestObject.devicetype){
        var obj = {};
        requestObject.name && ( obj.name = requestObject.name);


        var updateObj = {
            condition : {_id : requestObject.devicetype},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };


        db.update('devicetypes', updateObj, cb);
    }else{
        cb("INVALID_DEVICETYPE_ID", null)
    }
};


var disable = function(requestObject, cb){

    if(requestObject && requestObject.siteId){
        var obj = {
            disabled : true,
            disabledBy : requestObject.user._id
        };

        var updateObj = {
            condition : {_id : requestObject.devicetype},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };

        db.update('devicetypes', updateObj, cb);
    }else{
        cb("INVALID_DEVICETYPE_ID", null);
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

    /* DB Query*/
    db.find('devicetypes', criteria, cb);
};

var count = function(requestObject, cb){

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
    db.count('devicetypes', criteria, cb);
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
        criteria.condition.customer = requestObject.user.customer;
    }

    criteria.condition.disabled = {$ne : true}

    if(!_.isEmpty(requestObject.sort)){
        criteria.sort=requestObject.sort
    }

    /* DB Query*/
    db.find('devicetypes', criteria, cb);
};

module.exports = {
    validateSiteName : validateSiteName,
    create : create,
    edit : edit,
    disable : disable,
    list : list,
    count : count,
    listIdText : listIdText
}