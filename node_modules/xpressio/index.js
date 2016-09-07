/**
 * Created by harinaths on 7/1/15.
 */


/*NPM Modules*/
var express = require('express');
var session = require('express-session');
var cookie = require('cookie');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var RedisStore = require('connect-redis')(session);
//var sessionStore = new RedisStore() // new session.MemoryStore() || new RedisStore()
var sessionStore = null // new session.MemoryStore() || new RedisStore()
var COOKIE_SECRET = 'secret';
var COOKIE_NAME = 'sid';

var XPressIO = function (config) {
    this.config = config;
    //    return this;
};

XPressIO.prototype.start = function () {
    var app = this.app = express();
    this.app.engine('.html', require('ejs').__express);
    app.set('views', this.config.viewPath || __dirname + '/views');
    app.set('view engine', 'html');
    app.use(bodyParser.urlencoded({
        extended: false
    }))
    app.use(bodyParser.json());

    app.use(express.static(this.config.publicPath || __dirname + '/public'));


    if (this.config.sessionStore) {
        sessionStore = this.config.sessionStore ? new RedisStore() : new session.MemoryStore();
        app.use(cookieParser(COOKIE_SECRET));
        app.use(session({
            name: COOKIE_NAME,
            store: sessionStore,
            secret: COOKIE_SECRET,
            saveUninitialized: true,
            resave: true,
            cookie: {
                path: '/',
                httpOnly: true,
                secure: false,
                maxAge: null
            }
        }));
    }
    this.server = require('http').Server(this.app).listen(this.config.port);

    if (this.config.socketIO) {
        this.socketIOInitialize();
    }


    return this;


};


XPressIO.prototype.socketIOInitialize = function () {
    this.io = require('socket.io')(this.server);
    this.io.on('connection', function (socket) {
        console.log("SocketIO Client SID : ", socket.handshake.sid) //SESSION ID
        socket.on('join', function (room) {
            room && socket.join(room);
        });
        socket.join(socket.handshake.sid)
        socket.on('disconnect', function () {
            console.log("SOCKET DISCONNECTED....");
        });
        socket.on('error', function (err) {
            console.log(err);
        });
    });
    this.io.use(function (socket, next) {
        try {
            var data = socket.handshake || socket.request;
            if (!data.headers.cookie) {
                return next(new Error('Missing cookie headers'));
            }
            //        console.log('cookie header ( %s )', JSON.stringify(data.headers.cookie));
            var cookies = cookie.parse(data.headers.cookie);
            //        console.log('cookies parsed ( %s )', JSON.stringify(cookies));
            //
            if (!cookies[COOKIE_NAME]) {
                return next(new Error('Missing cookie ' + COOKIE_NAME));
            }

            //        console.log("Cookie Name : ", cookies[COOKIE_NAME])
            var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], COOKIE_SECRET);
            if (!sid) {
                return next(new Error('Cookie signature is not valid'));
            }
            //        console.log('session ID ( %s )', sid);
            data.sid = sid;
            sessionStore.get(sid, function (err, session) {
                //
                //            console.log("SESSION OBJECT : ",session);
                //
                if (err) return next(err);
                if (!session) return next(new Error('session not found'));
                data.session = session;
                next();
            });
        } catch (err) {
            console.error(err.stack);
            next(new Error('Internal server error'));
        }
    });
};




module.exports = XPressIO;