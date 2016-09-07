/**
 * Created by administrator on 30/9/14.
 */

var users= require('./actions/users-actions');

module.exports = function (app) {

    /*Users*/
    app.get('/users/validate/name',users.validate );

    app.post('/users/create', users.create);

    app.post('/users/edit', users.edit);

    app.post('/users/usersitedetails', users.usersitedetails);

    app.post('/users/disable', users.disable);

    app.post('/users/listIdText',users.listIdText);

    app.post('/users/login', users.login);

    app.get('/user/activation' , users.activate);

    app.post('/users/signup',users.register);

    app.get('/users/logout', users.logout);

    app.get('/users/remove', users.remove);

    app.get('/users/list', users.list);

    app.get('/users/count', users.count);

    app.get('/users/listncount', users.listncount);

    // forget password newly added

    app.post('/users/forgetPassword',users.getAccountByEmail);

    app.get('/users/reset_password',users.resetPassword);

    app.post('/users/updateresetPassword' , users.saveResetPassword);

    app.get('/admin/users' , function(req,res){
        res.redirect('/home');
    });
};