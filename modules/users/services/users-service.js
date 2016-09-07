/**
 * Created by harinaths on 12/8/14.
 */

var db = global.db;
var _ = require('underscore');
var async = require('async');
var node_cryptojs = require('node-cryptojs-aes');
var CryptoJS = node_cryptojs.CryptoJS;
var crypto = require('crypto');
var EM = require(global.root + '/modules/global/services/email-dispatcher');
var mailConfig = global.config.mail
var server = mailConfig.serverID;

/*
 var getUser = function(requestObject, cb){
 var criteria = {
 condition : { username : requestObject.username }
 };
 //    criteria.condition.isActive = {$e : true};
 db.findOne('users', criteria, function(err, data) {
 if(_.isEmpty(data)){
 cb( null,"USER_DOES_NOT_EXIST");
 } else {
 cb(null,data)
 }
 })
 };*/


var getUser = function(req, cb){

    var data = req.body;
//    console.log("REQ.BODY" , req.body);

    if(data.username && data.h=='$'){
        var criteria = {
            condition : {
                username : data.username
                // password :decrypted,
                //isActivate:true
            },
            sort: { },
            pagination : { },
            requiredFields : {  }
        };
        db.findOne('users',criteria, function(err, user){
            if(!err && user){
                req.session.user = user;
//                console.log("req.session.user",req.session.user);
                delete user.password
                cb(null, {user:user});
            }else{
                cb("Invalid Account", null);
            }
        });
    }else if(data.username && data.password){
        var decrypted = CryptoJS.AES.decrypt(data.password, req.session.uniqueID.toString()).toString(CryptoJS.enc.Utf8);
//        console.log(decrypted);
        var criteria = {
            condition : {
                username : data.username
                // password :decrypted,
                //isActivate:true
            },
            sort: { },
            pagination : { },
            requiredFields : {  }
        };
//        console.log(criteria)
        db.findOne('users',criteria, function(err, user){
            //console.log("data..................",err, user)
            if(!err && user){

                validatePassword(decrypted, user.password, function(err, res) {
                    if (res){
                        req.session.user = user;
                        req.session.user = user;
                                cb(null, {user:user});
                    }
                    else{
                        cb('invalid-password');
                    }
                });
            }else{
                cb("Invalid Account", null);
            }
        })
    }else{
        cb("Please pass valid arguments", null);
    }
};


var getRole = function(roleid, cb){
    var criteria = {
        condition : { _id : roleid }
    }
//    console.log(criteria)
    db.findOne('roles', criteria, cb);
};
/*
 var getRolecomplex = function(requestObject, cb){

 var criteria = {
 condition: { username: requestObject.username }
 }
 //            console.log("...........................................................",criteria)
 db.findOne('users', criteria, //cb);
 function(err,data){
 var criteria = {
 condition: { _id: data.roleid }
 }
 db.findOne('roles', criteria, cb);
 });

 };*/
var checkUserExist = function(requestObject, cb){

    var criteria = {
        condition : { username : requestObject.username }
    };
    db.findOne('users', criteria, function(err, user){

        if(!err && !user){
            cb(null, null);
        }else{
            cb("USER_EXISTS", null)
        }
    });
}
//var create = function(requestObject, cb){
//    var pw = null;
//
//    saltAndHash(requestObject.password,function(err,res){
//        pw = res;
//    });
//
//    var user = {
//        fullname : requestObject.fullname,
//        username : requestObject.username,
//        password : pw,//requestObject.password,
//        phoneno : requestObject.phoneno,
//        organization : requestObject.user.organization,
//        siteaccess : requestObject.siteaccess,
//        isActivate:  requestObject.isactive,
//        customer : requestObject.customerId,
//        accessKey : requestObject.accessKey,
//        created : {
//            created_by : requestObject.user._id,
//            created_ts : new Date().getTime(),
//            created_by_name : requestObject.user.fullname
//        },
//        modified : {
//            modified_by : requestObject.user._id,
//            modified_ts : new Date().getTime(),
//            modified_by_name : requestObject.user.fullname
//        }
//    }
////    console.log(user);
//    db.save('users',user,cb);
//}
//var edit = function(requestObject, cb){
//    var updateObject = {
//        firstname : requestObject.firstname,
//        lastname : requestObject.lastname,
//        username : requestObject.username,
//        password : requestObject.password,
//        contactnumber : requestObject.contactnumber,
//        department : requestObject.department,
//        roleid : requestObject.roleid,
//        sitedetails : requestObject.sitedetails,
//        modified_by : requestObject.user._id,
//        modified_ts : new Date().getTime()
//    }
//    var updateObj = {
//        condition : {  _id : requestObject.userId  },
//        value : { $set : updateObject },
//        options : {multi : false, upsert : false}
//    };
////    console.log(updateObj)
//    db.update('users', updateObj, cb);
//};


var create = function(requestObject, cb){
    var pw = null;

    saltAndHash(requestObject.password,function(err,res){
        pw = res;
    });

    var user = {
        fullname : requestObject.fullname,
        username : requestObject.username,
        password : pw,//requestObject.password,
        phoneno : requestObject.phoneno,
        organization : requestObject.user.organization,
        siteaccess : requestObject.siteaccess,
        isActivate:  requestObject.isactive,
        customer : requestObject.customerId,
        accessKey : requestObject.accessKey,
        created : {
            created_by : requestObject.user._id,
            created_ts : new Date().getTime(),
            created_by_name : requestObject.user.fullname
        },
        modified : {
            modified_by : requestObject.user._id,
            modified_ts : new Date().getTime(),
            modified_by_name : requestObject.user.fullname
        }
    }
//    console.log(user);
    db.save('users',user,cb);
}
var edit = function(requestObject, cb){


    var updateObject = {
        fullname : requestObject.fullname,
        username : requestObject.username,
        phoneno : requestObject.phoneno,
        organization : requestObject.user.organization,
        siteaccess : requestObject.siteaccess,
        isActivate:  requestObject.isactive,
        customer : requestObject.customerId,
        accessKey : requestObject.accessKey,
        modified : {
            modified_by : requestObject.user._id,
            modified_ts : new Date().getTime(),
            modified_by_name : requestObject.user.fullname
        }
    };

//    console.log("request object in user edit : ",requestObject);

    var updateObj = {
        condition : {  _id : requestObject.userId  },
        value : { $set : updateObject },
        options : {multi : true}
    };
//    console.log("update in user service",updateObj);
    db.update('users', updateObj, cb);
};


var usersitedetails = function(requestObject, cb){
//    console.log("print the requestObject>>>>>",requestObject);
    var count=0;

    var keys = Object.keys(requestObject.arrayOfUsers);
    async.forEachSeries(keys, function (item, callback){
        var updateObject = {
            sitedetails : requestObject.sitedetails,
            modified_by : requestObject.user._id,
            modified_ts : new Date().getTime()
        }
        var updateObj = {
            condition : {},
            value : { $set : updateObject },
            options : {multi : false, upsert : false}
        };
//        console.log("print the key>>>>>",requestObject.arrayOfUsers[item]); // print the key
        updateObj.condition._id = db.ObjectId(requestObject.arrayOfUsers[item].toString());
        count++;
//        console.log("print the updateObj>>>>>",updateObj); // print the updateObj
        /* DB Query*/
        db.update('users', updateObj,function(){
//            console.log("UPDATE STATUS :::: ", arguments);
            callback(null);
        }); //cb);
//            function (err, data) {
//                console.log("print data whatsoever ",data);
//                callback();
//            });
        // tell async that the iterator has completed
    }, function(err,data) {
//        console.log('iterating done',err,".......................",data);
        if(keys.length === count){
            cb();
        }
    });
};
var removeUser = function(requestObject, cb){
    var criteria = {
        condition : {_id : {$in : requestObject.users}}
    }
    db.remove('users', criteria , cb);
};
var list = function(requestObject, cb){
//    console.log("user from request object check.....",requestObject.user);
    var criteria = {
        condition : {customer:requestObject.user.customer},
        sort: { },
        pagination : { }
//        ,
//        requiredFields : { password : 0 }
    };
    /* User based DeviceTypes*/
//    if(!_.isEmpty(requestObject.user)){
//        criteria.condition.user = requestObject.user._id
//    }
    /* Paginated Records */
//    if(requestObject.pagination && requestObject.pagination.required){
//        if(requestObject.pagination.pageNumber && requestObject.pagination.recordsPerPage )
//        {
//            var limit = parseInt(requestObject.pagination.recordsPerPage) ;
//            criteria.pagination['skip'] = (limit * (requestObject.pagination.pageNumber - 1));
//            criteria.pagination['limit'] = limit;
//        }
//        else if( requestObject.pagination.recordsPerPage)
//        {
//            var limit = parseInt(requestObject.pagination.recordsPerPage) ;
//            criteria.pagination['limit'] = limit;

//            if(requestObject.pagination.lastRecordId)
//            {
//                criteria.condition._id = { $lt: ObjectId(requestObject.pagination.lastRecordId.toString()) }
//            }
//        }
//    }
//    if(!_.isEmpty(requestObject.sort)){
//        criteria.sort=requestObject.sort
//    }
    /* DB Query*/
//    db.find('users', criteria, cb);
    db.find('users', criteria, function(err,data){
//        console.log("LIST STATUS :::: ", arguments);
//        console.log("LIST STATUS data:::: ", data);

//        console.log("LIST STATUS data length:::: ", data.length);
        for(var i = 0; i<data.length;i++){

//            console.log("each data:::: ", data[i].password);

            var pw = null;

            saltAndHash(data[i].password,function(err,res){
                pw = res;
            });

//            console.log("decrypt pwd",pw);
        }
        cb(data);
    });
};
/* Total Count of Users */
var count = function(requestObject, cb){
    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : {  }
    };
    /* DB Query*/
    db.count('users', criteria, cb);
};
var disable = function(requestObject, cb){
    if(requestObject){
        var obj = {
            isActivate : false,
            modified:{
                modified_by : requestObject.user._id,
                modified_ts : new Date().getTime(),
                modified_by_name : requestObject.user.fullname
            }
        };
        var updateObj = {
            condition : {_id : {$in :requestObject.userIds } },
            value : {$set : obj},
            options : {multi : true}
        };
        db.update('users', updateObj, cb);
    }else{
        cb("INVALID_USER_ID", null)
    }
};

var listIdText = function(requestObject, cb){

    var criteria = {
        condition : {},
        sort: { },
        pagination : { },
        requiredFields : { id:1, username:1 }
    };

    /* List roles created by logged in user*/

    if(!_.isEmpty(requestObject.customerId)){
//        console.log("user._id ",requestObject.user._id )
        criteria.condition.customer = requestObject.customer;
    }

    criteria.condition.disabled = {$ne : true}

    if(!_.isEmpty(requestObject.sort)){
        criteria.sort=requestObject.sort
    }

    /* DB Query*/
    db.find('users', criteria, cb);
};





var generateSalt = function()
{
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};

var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback)
{
    var salt = generateSalt();
    callback(null, salt + md5(pass + salt));
};

var validatePassword = function(plainPass, hashedPass, callback)
{
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(null, hashedPass === validHash);
};


var saveUser=function(saveObject, cb){
    var criteria = {
        condition : {email : saveObject.username},
        requiredFields : {}
    };
    db.findOne('users', criteria, function(err,docs){
//        console.log("IS THERE.................",docs);
        if(!err && !docs){
            db.save('users', saveObject , cb);

            EM.sendActivationLink(saveObject, function(err, response){
//                console.log("MAIL Response....", response)
            })


        }else{
            cb("Username or Email is already registered with us",null);
        }
    });

};

var activateAccount = function(req, cb){

    // console.log("activation id......................",req.query.activationId);
    var activationId = req.query.activationId;

    var criteria = {
        condition : {
            activationId :activationId,
            isActivate:false
        },
        requiredFields : {}
    };
    var updateObj = {
        condition : {activationId : activationId},
        value : {$set : {isActivate:true}},
        options : {multi : false, upsert : false}
    };

    //console.log("criteria...........",criteria)

    db.findOne('users', criteria, function(err,docs){
//        console.log("activating account det....................",docs);
        if(!err && docs){
            db.update('users', updateObj , cb);
            cb(null, "Activated");
        }else{
            cb(null,"Your Account is already Activated with us");
        }
    })
};



var getAccountByEmail = function(email, callback)
{
    var criteria = {
        condition : {email:email},

        requiredFields : {}
    }
    db.findOne('users',criteria, function(e, o){ callback(o); });

}

var getAccountByEmailPassword = function(object, callback)
{
    var criteria = {
        condition : {
            email:object.email,
            pwdResetId : object.pwdResetId,
            pwdFlag : false
        },
        requiredFields : {}
    }
    db.findOne('users',criteria, function(e, o){
        callback(o);
    });

}


var passwordResetEmail = function(account, callback)
{
    var pwdResetId =randomstring.generate(7);
    var updateObj = {
        condition : { email : account.email },
        value : { $set : {pwdResetId : pwdResetId,pwdFlag : false} },
        options : { multi : false, upsert : false }
    };
    async.parallel({
        //dbupadte : )

        userUpdate : function(cb){
            db.update('users',updateObj, function(e, o){ cb(o); })
        },
        forgetEmailNotification : function(cb){
            /*  var mailOptions = {
             from: "MCloud <mcloudframework@gmail.com>", // sender address
             to           : account.email,
             subject      : 'Password Reset',
             html   : composeEmail(account,pwdResetId)
             };*/
            // mail.sendMail(mailOptions, cb)
            account.pwdResetId = pwdResetId;
            EM.dispatchResetPasswordLink(account,cb)
        }

    },callback)

}

var composeEmail = function(o,pwdResetId)
{
    var link = server+'/reset_password?e='+o.email+'&pwdResetId='+pwdResetId+"'";
    //console.log("link...........",link)
    //var html = "<html><body>";
    var html = "Hi "+o.username+",<br><br>";
    html += "<br><a href='"+link+"'>Please click here to reset your password</a><br><br>Thanks,<br>MCloud<br>";
    //html += "</body></html>";
    return  html;
}


var updateNewPassword = function(o,callback){
    //console.log("last..............",o)
    db.update('users',o,function(e, cb){
        callback(null,cb);
    })
}



module.exports = {
    getUser : getUser,
    getRole : getRole,
    checkUserExist : checkUserExist,
    create : create,
    edit : edit,
    disable : disable,
    removeUser : removeUser,
    list : list,
    count : count,
    validatePassword:validatePassword,
    saltAndHash:saltAndHash,
    listIdText : listIdText,
    usersitedetails : usersitedetails,
    saveUser:saveUser,
    activate:activateAccount,
    getAccountByEmail : getAccountByEmail,
    passwordResetEmail : passwordResetEmail,
    getAccountByEmailPassword: getAccountByEmailPassword,
    updateNewPassword : updateNewPassword
};