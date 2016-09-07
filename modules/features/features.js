/**
 * Created by abhishekgoray on 10/10/14.
 */

var features = require('./actions/featureprivilege-actions');

module.exports = function (app) {

    app.post('/featureprivilege/disable', features.disable);

    app.get('/features/list', features.list);

};


