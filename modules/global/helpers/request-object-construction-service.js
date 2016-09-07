/**
 * Created by harinaths on 12/8/14.
 */

var db = global.db;
var ObjectId = db.ObjectId;
var randword = require('secure-randword');
var async = require('async');
var _ = require('underscore');

var setPassedArguments = function(_object, cb){
    cb(null, _object);
};

var setPassedArgumentsStrict = function(_object, cb){
    _object ? cb(null, _object) : cb("EMPTY ARGUMENTS TO SET");
};

var sessionUsersCustomerId = function(req, cb){
    if(req.session && req.session.user && req.session.user.customer){
        cb(null, db.ObjectId(req.session.user.customer.toString()))
    }else{
        cb(null, null);
    }
};

var getObjectId = function(value, cb){

    cb(null,value ? db.ObjectId(value) : null);
};


var randomAccessCode = function(value, cb){
    console.log(randword());
    cb(null, randword())
}

var sessionUsersCustomerAccessKey = function(req, cb){
    if(req.session && req.session.user && req.session.user.accessKey){
        cb(null, req.session.user.accessKey)
    }else{
        cb(null, null);
    }
};


var getAsObjectIds = function(list, cb){
    var objects = [];

    var iterator = function(listItem, iterator_cb){
        try{
            if(listItem){
                objects.push(db.ObjectId(listItem))
                iterator_cb(null);
            } else{
                iterator_cb('INVALID_DB_OBJECT');
            }
        }catch (e){
            cb("INVALID_DB_OBJECT");
        }

    }

    async.forEach(list || [], iterator, function(err){
        err ? cb(err, null) : cb(null, objects);
    });

};

var getUserSites = function(req, cb){
    var obj = [];

    var iterator = function(listItem, iterator_cb){
        try{
            if(listItem){


                listItem = db.ObjectId(listItem)
                obj.push(listItem)
//                console.log("listItem : ",listItem)
                iterator_cb(null);
            } else{
                iterator_cb('INVALID_DB_OBJECT');
            }
        }catch (e){
            cb("INVALID_DB_OBJECT");
        }

    }

    async.forEach(req.session.user.sites || [], iterator, function(err){
//        console.log("*****************************", err)
//        console.log("Session Sites : ",req.session.user.sites)
//        console.log("Obj Sites : ",obj)
        err ? cb(err, null) : cb(null, obj);
    });

};

var setPassedArray = function(list, cb){
    var items = [];

    var iterator = function(listItem, iterator_cb){
        try{
            if(listItem){
                items.push(listItem)
                iterator_cb(null);
            } else{
                iterator_cb('INVALID_DB_OBJECT');
            }
        }catch (e){
            cb("INVALID_DB_OBJECT");
        }

    }

    async.forEach(list || [], iterator, function(err){
        err ? cb(err, null) : cb(null, items);
    });

};


var pagination = function( req , cb ){
    var paginateData = {
        required : (req[reqMethodLookup[req.method]]['pagination'] && req[reqMethodLookup[req.method]]['pagination']['required'] && (req[reqMethodLookup[req.method]]['pagination']['required']*1 || 0) ) || null,
        pageNumber : (req[reqMethodLookup[req.method]]['pagination'] && req[reqMethodLookup[req.method]]['pagination']['pageNumber'] && (req[reqMethodLookup[req.method]]['pagination']['pageNumber']*1) ) || null,
        recordsPerPage : (req[reqMethodLookup[req.method]]['pagination'] && req[reqMethodLookup[req.method]]['pagination']['recordsPerPage'] && (req[reqMethodLookup[req.method]]['pagination']['recordsPerPage'] * 1)) || null,
        lastRecordId : (req[reqMethodLookup[req.method]]['pagination'] && req[reqMethodLookup[req.method]]['pagination']['lastRecordId']) ? db.ObjectId(req[reqMethodLookup[req.method]]['pagination']['lastRecordId']) : null|| null
    };

    cb(null,paginateData);
};


var reqMethodLookup = {
    POST : 'body',
    GET : 'query'
}


/* Pagination
var pagination = function( req , cb ){

    var paginateData = {
        required : (req.query.pagination && (req.query.pagination*1 || 0) ) || null,
        pageNumber : (req.query.pageNumber && (req.query.pageNumber*1) ) || null,
        recordsPerPage : (req.query.recordsPerPage && (req.query.recordsPerPage * 1)) || null,
        lastRecordId : req.query.lastRecordId ? db.ObjectId(req.query.lastRecordId) : null|| null
    };
    cb(null,paginateData);
};

*/

var sort = function( req , cb ){
    if(!_.isEmpty(req.body.sort)){
        var sortObj = {};

        async.forEach(_.keys(req.body.sort), function(key , iterator_cb){
            sortObj[key] =  req.body.sort[key]*1;
            iterator_cb(null);
        }, function(err){
            console.log(sortObj)
            cb(null,sortObj);
        });

    }else{
        cb(null, null);
    }


};


var sessionUser = function(req, cb){


    if(req.session && req.session.user ){
        req.session.user._id = db.ObjectId(req.session.user._id)
        req.session.user.customer = db.ObjectId(req.session.user.customer)
        cb(null, req.session.user)
    }else{
        cb("INVALID_SESSION_USER", null)
    }

}

var getDateRange  = function(dateRange, cb){
    if(dateRange && dateRange.from && dateRange.to){
        cb(null, {from : new Date(dateRange.from), to : new Date(dateRange.to)});
    }else{
        cb(null, null)
    }
}

module.exports = {
    getAsObjectIds : getAsObjectIds,
    setPassedArguments : setPassedArguments,
    setPassedArgumentsStrict : setPassedArgumentsStrict,
    sessionUsersCustomerId : sessionUsersCustomerId,
    getObjectId : getObjectId,
    randomAccessCode : randomAccessCode,
    sessionUsersCustomerAccessKey : sessionUsersCustomerAccessKey,
    pagination : pagination,
    sort : sort,
    sessionUser : sessionUser,
    getDateRange : getDateRange,
    setPassedArray : setPassedArray,
    getUserSites : getUserSites
};