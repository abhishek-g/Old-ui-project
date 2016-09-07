/**
 * Created by sneha on 27/8/14.
 */

var _ = require('underscore');
var async = require('async');
var db = global.db;
/*Create Role*/
var create = function(requestObject, cb){
//    console.log("check requestObject details ",requestObject)
    if(requestObject){
    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : {  }
    };
    criteria.condition.rolename = requestObject.rolename;
    /* DB Query*/
    db.find('roles', criteria, //cb);
        function(err, data){
            if(_.isEmpty(data)){
                var obj = {
                    rolename : requestObject.rolename,
                    roledetails : requestObject.roledetails,
                    customer : requestObject.customerId,
                    accessKey : requestObject.accessKey,
                    user : requestObject.user._id,
                    created_by : requestObject.user._id,
                    created_ts : new Date().getTime(),
                    modified_by : requestObject.user._id,
                    modified_ts : new Date().getTime()
                };
                db.save('roles', obj , cb);
            }
            else{
                cb("ROLE WITH SAME NAME ALREADY EXISTS!", null)
            }
        })
    }else{
        cb("FAILED", null)
    }
}

var edit = function(requestObject, cb){
//    console.log("requestObject in roles-service ",requestObject)
    if(requestObject){
        var obj = {};
        obj.rolename = requestObject.rolename;
        obj.roledetails = requestObject.roledetails;
        obj.customer = requestObject.customerId;
        obj.accessKey = requestObject.accessKey;
        obj.user = requestObject.user._id;
        obj.modified_by = requestObject.user._id;
        obj.modified_ts = new Date().getTime();

//console.log("obj in roles-service ",obj)
        var updateObj = {
            condition : {_id : requestObject.roleId},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };


        db.update('roles', updateObj, cb);
    }else{
        cb("INVALID_ROLE_ID", null)
    }
}

var disable = function(requestObject, cb){
    if(requestObject){
        var obj = {
            disabled : true
        };
        obj.modified_by = requestObject.user._id;
        obj.modified_ts = new Date().getTime();
//        console.log("obj in roles-service : ", obj)
        var updateObj = {
            condition : {_id : requestObject.roleId},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };

//        console.log("updateObj in roles-service : ", updateObj)
        db.update('roles', updateObj, cb);
    }else{
        cb("INVALID_ROLE_ID", null)
    }
}

var list = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : {  }
    };

    /* List roles created by logged in user*/

    if(!_.isEmpty(requestObject.customerId)){
        criteria.condition.customer = requestObject.customer;
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

    /* DB Query*/
    db.find('roles', criteria, cb);
};

var listIdText = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : { id:1, rolename:1 }
    };

    /* List roles created by logged in user*/

    if(!_.isEmpty(requestObject.customerId)){
//        console.log("customer ",requestObject.customer )
        criteria.condition.customer = requestObject.customer;
    }

    criteria.condition.disabled = {$ne : true}

    if(!_.isEmpty(requestObject.sort)){
        criteria.sort=requestObject.sort
    }

    /* DB Query*/
    db.find('roles', criteria, cb);
};

module.exports = {
    create : create,
    edit : edit,
    disable : disable,
    list :list,
    listIdText : listIdText
}