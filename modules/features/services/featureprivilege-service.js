/**
 * Created by sneha on 07/10/14.
 */

var _ = require('underscore');
var async = require('async');
var db = global.db;
var disable = function(requestObject, cb){

    if(requestObject){
        var obj = {
            disabled : true
        };

        var updateObj = {
            condition : {_id : requestObject.featureprivilegeid},
            value : {$set : obj},
            options : {multi : false, upsert : false}
        };

        db.update('feature_privileges', updateObj, cb);
    }else{
        cb("INVALID_FEATUREPRIVILEGE_ID", null)
    }
}
var list = function(requestObject, cb){
    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : {  }
    };
    criteria.condition.disabled = {$ne : true}
    async.series({
        getAllFeaturePrivileges: function (cb) {
            /* DB Query */
            db.find('features', criteria,cb);
        }
        },
        function (err, data) {
            console.log("print all features and privileges", data);
            cb(null,data['getAllFeaturePrivileges']);
        })
};

module.exports = {
    disable : disable,
    list : list
}