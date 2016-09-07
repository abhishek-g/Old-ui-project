/**
 * Created by sneha on 07/10/14.
 */


/* Supporting Node Modules */
var async = require('async');
var _ = require('underscore');


/* System Modules */
var ReqCS = require(global.root + '/modules/global/helpers/request-object-construction-service');
var ResCS = require(global.root + '/modules/global/helpers/response-object-construction-service');
var featureprivilegeService = require('./../services/featureprivilege-service');

var disable = function (req, res) {
    async.parallel({
        featureprivilegeid: function (cb) {
            ReqCS.getObjectId(req.body.featureprivilegeid, cb);
        }
    }, function (err, requestObject) {

        async.series({
            getfeatureprivilegeid: function (cb) {
                featureprivilegeService.disable(requestObject, cb);
            }
        }, function (err, _object) {
            var response = {
                status: err ? 400 : 200,
                data: err || "UPDATED"
            }
            res.send(response);
        });
    });
};
//get all features and privileges
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
        }
    }, function (err, requestObject) {
        async.series({
            list: function (cb) {
                featureprivilegeService.list(requestObject, cb);
            }
        }, function (err, data) {
            var response = {
                status: err ? 400 : 200,
                data: err || data.list,
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
    disable: disable,
    list: list
};
