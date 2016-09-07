


var config = {
    http: {
        port: 8966,
        viewPath: __dirname + '/views', //Template Engine
        publicPath: __dirname + '/public', //Public Folder (Javascript, CSS)
        sessionStore: true,
        socketIO: true
    },
    database: {
        service: 'MONGODB',
        url: 'mongodb://54.169.72.29:12345/solarpulse_amity'
    },
    mqtt: {
        host: '0.0.0.0',
        port: 1883,
        json: true
    },
    rabbitmq: {
        host: '54.169.72.29',
        port: '5672',
        login: 'guest',
        password: 'guest',
        vhost: '/'

    },
    mail: {
        host: 'smtp.gmail.com',
        user: 'mcloudframework@gmail.com',
        password: '123qwe@123',
        sender: 'mcloudframework@gmail.com',
        serverID: 'http://0.0.0.0:8966'
    }
};

var liveconfig = {
    http: {
       port : 4574,
        viewPath: __dirname + '/views', //Template Engine
        publicPath: __dirname + '/public', //Public Folder (Javascript, CSS)
        sessionStore: true,
        socketIO: true
    },
    database: {
        service: 'MONGODB',
        url : 'mongodb://54.169.72.29:12345/solarpulse_amity'
    },
    mqtt: {
        host: '0.0.0.0',
        port: 1883,
        json: true
    },
    rabbitmq: {
        host: '54.169.72.29',
        port: '5672',
        login: 'guest',
        password: 'guest',
        vhost: '/'

    },
    mail: {
        host: 'smtp.gmail.com',
        user: 'mcloudframework@gmail.com',
        password: '123qwe@123',
        sender: 'mcloudframework@gmail.com',
        serverID: 'http://amity.erixis.io'
    }
};

//module.exports = liveconfig;
module.exports = config;
