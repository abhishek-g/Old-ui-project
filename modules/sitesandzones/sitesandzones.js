/**
 * Created by administrator on 30/9/14.
 */


var sites = require("./actions/sites-actions");
var zones = require("./actions/zones-actions");



module.exports = function(app){

    /*Sites*/
    app.get('/sites/validate/name',sites.validateSiteName );

    app.post('/sites/create', sites.create);

    app.post('/sites/edit', sites.edit);

    app.post('/sites/disable', sites.disable);

    app.get('/sites/list', sites.list);

    app.get('/sites/listncount', sites.listncount);

    app.get('/sites/count', sites.count);

    app.get('/sites/mapred', sites.mapred);

    app.post('/sites/listIdText',sites.listIdText);

    app.post('/sites/status',sites.status);

    app.post('/sites/allstatus',sites.allstatus);

    app.post('/sites/weather',sites.weather);

    app.post('/sites/pr',sites.pr);

    app.post('/sites/energy',sites.energy);

    app.post('/sites/activePower',sites.activePowerTrend);

    app.post('/sites/activePowerVSPoa',sites.activePowerVSPoa);

    app.post('/sites/activePowerVSPoaForHistory',sites.activePowerVSPoaForHistory);

    app.post('/sites/acVSPoa',sites.acVSPoa);

    app.post('/sites/zonePR',sites.zonePR);

    app.post('/sites/devicePR',sites.devicePR);

    app.post('/sites/plantYield',sites.plantYield);

    app.post('/sites/specificPower',sites.specificPower);

    app.post('/sites/siteSummary',sites.siteSummary);

    app.post('/sites/siteAggregatePR',sites.siteAggregatePR);

    /*Zones*/
    app.get('/zones/validate/name',zones.validateName );

    app.post('/zones/create', zones.create);

    app.post('/zones/edit', zones.edit);

    app.post('/zones/disable', zones.disable);

    app.get('/zones/list', zones.list);

    app.get('/zones/listncount', zones.listncount);

    app.get('/zones/count', zones.count);

    app.post('/zones/status',zones.status);

    app.post('/zones/newStatus',zones.newstatus);

    app.post('/zones/plantYield',zones.plantYield);

    app.post('/zones/specificPower',zones.activePowerTrend);

    app.get('/sites/hierarchy',sites.hierarchy );

    app.post('/zones/parameters',zones.parameters);

    app.post('/zones/zoneAggregatePR',zones.zoneAggregatePR);

    app.post('/zones/zonePeakPower',zones.zonePeakPower);

};