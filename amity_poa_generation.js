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




                    var zonesIterator = poaGenerationProcess;
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



var poaGenerationProcess = function(zone, zoneIteratorCB){

    var criteria = {
        condition : {zone:zone._id, typeName : {$in : ['Sensor Box','WSTATION']}},
        requiredFields : {}
    }

    db.find('devices', criteria, function(err,devices){
        //zoneIteratorCB(null);

        var devicesIterator = function(device,deviceIteratorCB) {


            if (device.name !== "WSTATION2") {

                console.log(device.name !== "WSTATION2", " ****** ",device.name);

                var ts = {$gte: moment().startOf('day')._d, $lte: moment().endOf('day')._d };
                async.series({
                    poa: function (selfCB) {
                        var zoneCriteria = [
                            { $match: { parameter: 'POA-Energy', zone: zone._id, device: device._id, ts: ts   }  }, //TYPE Inverter
                            { $project: { ts: 1, device: 1, deviceSn: 1, 'meta.orientation': 1, site: 1, zone: 1, gateway: 1, yield: { $subtract: [ '$end', '$start' ] } } },
                            { $group: { _id: {site: '$site', device: '$device', orientation: '$meta.orientation', 'deviceSn': '$deviceSn', zone: "$zone", ts: '$ts'}, yield: { $sum: '$yield' } } },
                            {$sort: {'_id.ts': 1}}
                        ];


                        db.aggregate('days', zoneCriteria, function (err, data) {


                            if (!err && data && data.length > 0) {


                                data[0].orientation = device.meta.orientation || 'common'
//                            console.log(data[0])
                                selfCB(null, data[0]);

                            } else {
                                selfCB(null);
                            }


                        })
                    },
                    generation: function (selfCB) {


//                        console.log('GENERATION : ');

                        var zoneCriteria = [
                            { $match: { '_id.zone': zone._id, '_id._d': ts   }  }, //TYPE Inverter
                            { $group: { _id: {zone: '$_id.zone', _d: '$_id._d'}, yield: { $sum: '$yield' } } }
                        ];


//                        console.log('CRITERIA : ', JSON.stringify(zoneCriteria))


                        db.aggregate('energyGeneration', zoneCriteria, function (err, data) {


                            if (!err && data && data.length > 0) {


                                selfCB(null, data[0]);

                            } else {
                                selfCB(null);
                            }


                        })


                    }
                }, function (err, details) {

//                    console.log(details);
                    console.log("******************************************************");


                    var dataObj = {
                        _id: {
                            site: zone.site,
                            zone: zone._id,
                            ts: (details.poa && details.poa._id && details.poa._id.ts) || null,
                            device: (details.poa && details.poa._id && details.poa._id.device) || null,
                            deviceSn: (details.poa && details.poa._id && details.poa._id.deviceSn) || null

                        },
                        capacity: zone.meta.capacity,
                        orientation: (details.poa && details.poa.orientation) || null,
                        energyGenreation: (details.generation && details.generation.yield) || 0,
                        poa: (details.poa && details.poa.yield) || 0

                    }
                    setTimeSlices.apply(dataObj._id, []);

                    var updateObj = {
                        condition: {_id: dataObj._id},
                        value: dataObj,
                        options: {multi: false, upsert: true}
                    };

                    db.update('poaGeneration', updateObj, deviceIteratorCB);


                })


            }else{
                deviceIteratorCB(null);
            }

        }
//ELSE


        async.each(devices || [], devicesIterator,function(err){
            zoneIteratorCB(null)
        })


    });

}

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
