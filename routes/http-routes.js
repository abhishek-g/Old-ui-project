/**
 * Created by mepc1216 on 3/7/14.
 */




module.exports = function (app) {

    console.log("INSIDE HTTP ROUTES");

//    app.get("/" , function(req,res){
//       res.render('home');
//    });


    require(global.root + '/modules/global/global')(app);

    require(global.root + '/modules/users/users')(app);

    require(global.root + '/modules/features/features')(app);

    require(global.root + '/modules/roles/roles')(app);

    require(global.root + '/modules/devices/devices')(app);

    require(global.root + '/modules/devicex/devicex')(app);

    require(global.root + '/modules/sitesandzones/sitesandzones')(app);

    require(global.root + '/modules/devicetypes/devicetypes')(app);

    require(global.root + '/modules/inverters/inverters')(app);
};




