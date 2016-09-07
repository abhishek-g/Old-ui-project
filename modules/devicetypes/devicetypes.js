/**
 * Created by administrator on 1/10/14.
 */

var devicetypes = require("./actions/devicetypes-actions");


module.exports = function(app){

    /*Device Types*/
    app.get('/devicetypes/validate/name',devicetypes.validateName);

    app.post('/devicetypes/create', devicetypes.create);

    app.post('/devicetypes/edit', devicetypes.edit);

    app.post('/devicetypes/disable', devicetypes.disable);

    app.get('/devicetypes/list', devicetypes.list);

    app.get('/devicetypes/listncount', devicetypes.listncount);

    app.get('/devicetypes/count', devicetypes.count);

    app.post('/devicetypes/listIdText',devicetypes.listIdText);
};