/* Global Default Values */
global.root = __dirname;

/* Congiguration */

var config = global.config = require('./config.js');

var devconfig = global.devconfig = require('./devconfig.js');

/* MongoDB*/
var Adaptor = require('mongo-adaptor');
var db = global.db = new Adaptor(config.database);
global.ObjectId = db.ObjectId;


/* Http Server*/
//var HttpServer =  require('mepc-http');
//var app = new HttpServer(config.http).connect();


var XPressIO = require('xpressio');
var xpress = new XPressIO(config.http).start();
var app = xpress.app;
var io = global.io = xpress.io;

var RabbitMQ = require('pipee'); //RabbitMQ
var queue = global.queue = new RabbitMQ;
var qconn = null;
//var db = null;



qconn = global.qconn = queue.connect(config.rabbitmq);
qconn.on('ready',function(){

    console.log("RABBITMQ CONNECTED ON : IP ", config.rabbitmq.host, " PORT : ", config.rabbitmq.port );

    queue.sub('amity_webApp', { ack:false, durable:true, prefetchCount :1 }, function(dataObject, q){
        console.log("ALARM" , dataObject);
        io.to('deviceAlarms').emit('deviceLiveAlarms', dataObject);
        q.acknowledge();

    });

});

qconn.on('error',function(){
    console.log("RABBITMQ CONNECTION ERR");
})

//####Emit a message to Client####

//io.to('#ClientSessionId').emit('message', message);

//####Emit a message to Room####

//io.to('#RoomName').emit('RoomTopic', message);

/*
app.use(function(req, res, next){
    res.render('404', { status: 404, url: req.url });
});
*/


/*
app.use(function(err, req, res, next){
    res.render('500', {
        status: err.status || 500
        , error: err
    });
});
*/

require('./routes/http-routes')(app);