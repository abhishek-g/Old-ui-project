/**
 * Created by anand on 13/11/14.
 */


var inverters = require("./actions/inverters-actions");

// TODO update actions

module.exports = function (app) {

    /*Inverters*/
    app.post('/inverters/status', inverters.status);

    app.post('/inverters/list', inverters.list);

    app.post('/inverters/alarms', inverters.alarms);

    app.post('/inverters/site/alarms', inverters.gAlarms);

    app.post('/inverters/site/alarmList', inverters.alarmList);

    app.put('/inverters/alarms', inverters.alarmsp);

    app.put('/inverters/editAlarms', inverters.editAlarmsp);

    app.post('/inverters/specificPower', inverters.activePowerTrend);

    app.post('/inverters/modTemp', inverters.modTempTrend);

    app.post('/inverters/ambTemp', inverters.ambTempTrend);

    app.post('/inverters/windSpeed', inverters.windSpeedTrend);

    app.post('/inverters/poa', inverters.poaTrend);

    app.post('/inverters/pr', inverters.pr);

    app.post('/inverters/prs', inverters.prs);

    app.post('/inverters/parameters', inverters.parameters);

    app.post('/inverters/ws', inverters.ws);

    app.post('/inverters/wsamb', inverters.wsamb);

    app.post('/inverters/modTempVsAmpTemp', inverters.modTempVsAmpTempTrend);

    app.post('/inverters/gstatus',inverters.gstatus );

    app.post('/inverters/gparameters',inverters.gparameters);

    app.post('/inverters/wsDailyWhm2', inverters.wsDailyWhm2);

    app.post('/wstation/windTrend', inverters.windTrend);

};