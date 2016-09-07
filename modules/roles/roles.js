/**
 * Created by administrator on 30/9/14.
 */


var roles = require('./actions/roles-actions');

module.exports = function(app){

    /*Roles*/

    app.post('/roles/create',roles.create);

    app.post('/roles/disable',roles.disable);

    app.get('/roles/list',roles.list);

    app.post('/roles/edit',roles.edit);

    app.get('/roles/listIdText',roles.listIdText);

    app.get('/admin/roles',function(req,res){

        if(req.session && req.session.user){
            res.render('admin');
        }else{
            req.session.uniqueID = global.db.ObjectId();
            res.redirect('/');
        }

    });
};