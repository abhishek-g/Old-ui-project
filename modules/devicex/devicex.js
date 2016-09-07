/**
 * Created by administrator on 30/9/14.
 */

var devicex= require('./actions/devicegateway-actions');

module.exports = function(app){

    app.get('/devicegateway/validate/name',devicex.validateName);

    app.post('/devicegateway/create', devicex.create);

    app.post('/devicegateway/edit', devicex.edit);

    app.post('/devicegateway/disable', devicex.disable);

    app.get('/devicegateway/list', devicex.list);

    app.get('/devicegateway/listncount', devicex.listncount);

    app.get('/devicegateway/count', devicex.count);

};