/**
 * Created by administrator on 30/9/14.
 */

var devices = require("./actions/devices-actions");

module.exports = function(app){

    /*Devices*/
    app.get('/devices/validate/name',devices.validateName);

    app.post('/devices/create', devices.create);

    app.post('/devices/edit', devices.edit);

    app.post('/devices/disable', devices.disable);

    app.get('/devices/list', devices.list);

    app.get('/devices/listncount', devices.listncount);

    app.get('/devices/count', devices.count);

    app.post('/devices/listIdText',devices.listIdText);

};