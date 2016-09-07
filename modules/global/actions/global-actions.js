/**
 * Created by administrator on 1/10/14.
 */



module.exports.forbidden = function(req,res){
    res.render('403');
};

module.exports.notfound = function(req,res){
    res.render('404');
};


module.exports.index = function(req, res){

    console.log("INSIDE GLOBAL");
    if(req.session && req.session.user){
        res.redirect("/dashboard");
    }else{
        req.session.uniqueID = global.db.ObjectId();
        console.log("obj id................",req.session.uniqueID);
        res.render('index',{'uniqueID' : req.session.uniqueID});
    }
};

module.exports.home = function(req,res){
    if(req.session && req.session.user){
        res.render('index',{'uniqueID' : req.session.uniqueID});
    }else{
        req.session.uniqueID = global.db.ObjectId();
        res.redirect('/');
    }
};


