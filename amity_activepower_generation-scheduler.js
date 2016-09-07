/**
 * Created by harinaths on 30/12/14.
 */
/**
 * Created by harinaths on 30/12/14.
 */

var tz = require('timezone/loaded');
var moment = require('moment');
var async = require('async');
global.root = __dirname;

/* Congiguration */

var config = global.config = require('./config.js');

/* MongoDB*/
var Adaptor = require('mongo-adaptor');
var db = global.db = new Adaptor(config.database);
global.ObjectId = db.ObjectId;




var CronJob = require('cron').CronJob;
new CronJob('0 * * * * *', function(){


    generateDailyGeneration();




}, null, true, "Asia/Kolkata");



var generateDailyGeneration = function(){
    async.series({
        zones : function(selfCB){
            var zonesCriteria = {
                condition : {},
                requiredFields : {}
            }

            db.find('zones', zonesCriteria, function(err,zones){

                if(!err && zones){




                    var zonesIterator = function(zone, zoneIteratorCB){

                        var deviceCriteria = {
                            condition : {zone:zone._id, typeName : 'GMETER'},
                            requiredFields : {}
                        };


                        db.find('devices', deviceCriteria, function(dQErr,devices){


                            if(!dQErr && devices){

                                if(devices.length > 0){
                                    setZoneGenerationByGmeter(zone,zoneIteratorCB)
                                }else{
                                    setZoneGenerationByInverter(zone,zoneIteratorCB)
                                }

                            }else{
                                process.nextTick(function(){zoneIteratorCB(null);})
                            }


                        })


                    };
                    async.eachSeries(zones, zonesIterator, function(zErr){
                        process.nextTick(function(){selfCB(null, null);})
                    })




                }else{
                    selfCB(null, null);
                }


            });
        },
        sites : function(selfCB){
            selfCB(null, null)
        }
    }, function(err, cb){

    })
};


var setZoneGenerationByGmeter = function(zone,zoneIteratorCB){
    var ts = {$gte : moment().startOf('day')._d, $lte : moment().endOf('day')._d };
//    console.log(ts)

    var zoneCriteria = [
        { $match: { parameter : 'gridActivePower', zone: zone._id, ts : ts   }  }, //TYPE Inverter
        {$sort : {'ts':1}},
        { $project: { ts:1,deviceId:1, deviceSn:1,site:1,zone:1,gateway:1,current:1 } },
        { $group: { _id: {site:'$site',gateway:'$gateway',zone:"$zone", ts : '$ts'}, activePower: { $sum: '$current' } } },
        {$sort : {'_id.ts':1}}
    ];



//    console.log(JSON.stringify(zoneCriteria));


    db.aggregate('days',zoneCriteria, function(err, data) {

        if(!err && data && data.length > 0){

            console.log("DATA LENGTH : ", data.length)


            var dataIterator = function(record, dataIteratorCB){



                setTimeSlices.apply(record._id,[]);

                console.log("Zone ", zone._id, " Generation by GMETER is ", record.activePower, '@ : ', record._id.ts);

                var updateObj = {
                    condition : {_id: record._id},
                    value : record,
                    options : {multi : false, upsert : true}
                };

                db.update('activePowerGeneration', updateObj, dataIteratorCB);



            }

            async.eachSeries(data, dataIterator, function(err){
                console.log("ERROR : ",err);
                zoneIteratorCB(null);

            })


        }else{
            console.log("Zone ", zone._id, " Generation by GMETER is -" );
            zoneIteratorCB(null);
        }

    });


};

var setZoneGenerationByInverter = function (zone, zoneIteratorCB) {

    var ts = {$gte : moment().startOf('day')._d, $lte : moment().endOf('day')._d };
//    console.log(ts)

    var zoneCriteria = [
        { $match: { parameter : 'invActivePower', zone: zone._id, ts : ts }  }, //TYPE Inverter
        {$sort : {'ts':1}},
        { $project: { ts:1,deviceId:1, deviceSn:1,site:1,zone:1,gateway:1,current:1 } },
        { $group: { _id: {site:'$site',gateway:'$gateway',zone:"$zone", ts : '$ts'}, activePower: { $sum: '$current' } } },
        {$sort : {'_id.ts':1}}
    ];
    console.log(JSON.stringify(zoneCriteria))
//    console.log(zoneCriteria)
    db.aggregate('days',zoneCriteria, function(err, data) {
        if(!err && data && data.length > 0){


            console.log("DATA LENGTH : ", data.length)


            var dataIterator = function(record, dataIteratorCB){

                setTimeSlices.apply(record._id,[]);
                console.log("Zone ", zone._id, " Generation by Inverter is ", record.activePower, '@ : ', record._id.ts);

                var updateObj = {
                    condition : {_id: record._id},
                    value : record,
                    options : {multi : false, upsert : true}
                };

                db.update('activePowerGeneration', updateObj, dataIteratorCB);



            }

            async.eachSeries(data, dataIterator, function(err){
                console.log("ERROR : ",err);
                zoneIteratorCB(null);

            })
        }else{
            console.log("Zone ", zone._id, " Generation by Inverter is -" );
            zoneIteratorCB(null);
        }
    });

};



var setTimeSlices = function(cb){

    try{
//        this._mi = moment(new Date(tz(this.ts,'Asia/Kolkata'))).startOf('minute')._d;
        this._h= moment(new Date(tz(this.ts,'Asia/Kolkata'))).startOf('hour')._d;
        this._d= moment(new Date(tz(this.ts,'Asia/Kolkata'))).startOf('day')._d;
        this._w= moment(new Date(tz(this.ts,'Asia/Kolkata'))).startOf('week')._d;
        this._mo= moment(new Date(tz(this.ts,'Asia/Kolkata'))).startOf('month')._d;
        this._y= moment(new Date(tz(this.ts,'Asia/Kolkata'))).startOf('year')._d;
        this._dt= moment(new Date(tz(this.ts,'Asia/Kolkata')))._d;
        cb && (cb(null, this));
    }catch(e){
        cb && (cb("ERROR @ SETTING TIME SCALES", null));
    }

};
