/**
 * Created by harinaths on 12/8/14.
 */

var async = require('async');
var ReqCS = require(global.root+'/modules/global/helpers/request-object-construction-service');
var ResCS = require(global.root+'/modules/global/helpers/response-object-construction-service');
var node_cryptojs = require('node-cryptojs-aes');
var CryptoJS = node_cryptojs.CryptoJS;
var randomstring = require('randomstring');
var userService = require('./../services/users-service');
var _ = require('underscore');

/* Validate User Name */
var validate = function (req, res) {

    async.parallel({

        name: function (cb) {
            ReqCS.setPassedArgumentsStrict(req.query.name, cb)
        },
        customer: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb)
        }
    }, function (err, requestObject) {
        async.series({

            validataion: function (cb) {
                userService.validate(requestObject, cb)
            }

        }, function (err, _object) {

            var response = {
                status: err ? 400 : 200,
                data: err || _object.validataion
            };
            res.send(response)

        });
    });
};

/* Create Users */
//var create = function(req, res){
//console.log("create user.....req object check.....",req.body);
//    async.parallel ({
//
//        firstname : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.firstname, cb ) },
//
//        lastname : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.lastname, cb ) },
//
//        username : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.username, cb ) },
//
//        password : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.password, cb ) },
//
//        contactnumber : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.contactnumber, cb ) },
//
//        department : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.department, cb ) },
//
//        roleid : function(cb){ ReqCS.getObjectId( req.body.roleid, cb ) },
//
//        sitedetails : function(cb){ ReqCS.setPassedArguments( req.body.sitedetails, cb ) },
//
//        customerId : function(cb){ ReqCS.sessionUsersCustomerId( req, cb ) },
//
//        accessKey: function (cb) { ReqCS.sessionUsersCustomerAccessKey(req, cb); },
//
//        user : function(cb){ ReqCS.sessionUser(req, cb);}
//
//    },function(err, requestObject){
//        if(!err){
//
//            async.series({
//
//                validation : function(cb){
//                    userService.checkUserExist(requestObject, cb)
//                },
//                user : function(cb){
//                    userService.create(requestObject, cb)
//                }
//
//            }, function(err, _object){
//
//                var response = {
//                    status : err ? 400 : 200,
//                    data : err || _object.user
//                }
//                res.send(response);
//
//            });
//
//
//        }else{
//            var response = {
//                status : err ? 400 : 200,
//                data : err
//            }
//            res.send(response)
//        }
//
//    })
//};

//var create = function(req, res){
//    console.log("create user.....req object check.....",req.body);
//    async.parallel ({
//
//        fullname : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.name, cb ) },
//
//        username : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.emailid, cb ) },
//
//        password : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.password, cb ) },
//
//        phoneno : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.telno, cb ) },
//
//        siteaccess : function(cb){ ReqCS.setPassedArray( req.body.siteaccess, cb ) },
//
//        isactive : function(cb){ ReqCS.setPassedArguments( req.body.isActive, cb ) },
//
//        customerId : function(cb){ ReqCS.sessionUsersCustomerId( req, cb ) },
//
//        accessKey: function (cb) { ReqCS.sessionUsersCustomerAccessKey(req, cb); },
//
//        user : function(cb){ ReqCS.sessionUser(req, cb);}
//
//    },function(err, requestObject){
//        if(!err){
//            console.log("create user.action....inside function");
//
//            async.series({
//
//                validation : function(cb){
//                    userService.checkUserExist(requestObject, cb)
//                },
//                user : function(cb){
//                    userService.create(requestObject, cb)
//                }
//
//            }, function(err, _object){
//                console.log("create user.action...._object",_object);
//
//                var response = {
//                    status : err ? 400 : 200,
//                    data : err || _object.user
//                }
//                console.log("create user.action....response",response);
//                res.send(response);
//
//            });
//
//
//        }else{
//            var response = {
//                status : err ? 400 : 200,
//                data : err
//            }
//            res.send(response)
//        }
//
//    })
//};
///*
//Edit Users
// */
//var edit = function(req, res){
//    async.parallel ({
//        userId : function(cb){ ReqCS.getObjectId( req.body.userId, cb ) },
//
//        firstname : function(cb){ ReqCS.setPassedArguments( req.body.firstname, cb ) },
//
//        lastname : function(cb){ ReqCS.setPassedArguments( req.body.lastname, cb ) },
//
//        username : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.username, cb ) },
//
//        password : function(cb){ ReqCS.setPassedArguments( req.body.password, cb ) },
//
//        contactnumber : function(cb){ ReqCS.setPassedArguments( req.body.contactnumber, cb ) },
//
//        department : function(cb){ ReqCS.setPassedArguments( req.body.department, cb ) },
//
//        roleid : function(cb){ ReqCS.getObjectId( req.body.roleid, cb ) },
//
//        sitedetails : function(cb){ ReqCS.setPassedArguments( req.body.sitedetails, cb ) },
//
//        user : function(cb){ ReqCS.sessionUser(req, cb);}
//    },function(err, requestObject){
//        if(!err){
//            async.series({
////                validation : function(cb){
////                userService.checkUserExist(requestObject, cb)
////                },
//                user : function(cb){
//                    userService.edit(requestObject, cb)
//                }
//            }, function(err, _object){
//                var response = {
//                    status : err ? 400 : 200,
//                    data : err || "MODIFIED"
//                }
//                res.send(response)
//            });
//        }else{
//            var response = {
//                status : err ? 400 : 200,
//                data : err
//            }
//            res.send(response)
//        }
//    });
//}

var create = function(req, res){
//    console.log("create user.....req object check.....",req.body);
    async.parallel ({

        fullname : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.fullname, cb ) },

        username : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.username, cb ) },

        password : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.password, cb ) },

        phoneno : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.phoneno, cb ) },

        siteaccess : function(cb){ ReqCS.setPassedArray( req.body.siteaccess, cb ) },

        isactive : function(cb){ ReqCS.setPassedArguments( req.body.isActivate, cb ) },

        customerId : function(cb){ ReqCS.sessionUsersCustomerId( req, cb ) },

        accessKey: function (cb) { ReqCS.sessionUsersCustomerAccessKey(req, cb); },

        user : function(cb){ ReqCS.sessionUser(req, cb);}

    },function(err, requestObject){
        if(!err){
//            console.log("create user.action....inside function");

            async.series({

                validation : function(cb){
                    userService.checkUserExist(requestObject, cb)
                },
                user : function(cb){
                    userService.create(requestObject, cb)
                }

            }, function(err, _object){
//                console.log("create user.action...._object",_object);

                if(err){

                    res.status(400).send(err);

                }else{

                    var response = {
                        status : err ? 400 : 200,
                        data : err || _object.user
                    };
//                    console.log("create user.action....response",response);
                    res.send(response);

                }

            });


        }else{
            var response = {
                status : err ? 400 : 200,
                data : err
            }
            res.send(response)
        }

    })
};
/*
 Edit Users
 */
var edit = function(req, res){
//    console.log("req..................in edit.......",req.body);
    async.parallel ({

        userId : function(cb){  ReqCS.getObjectId(req.body['_id'],cb)  },

        fullname : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.fullname, cb ) },

        username : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.username, cb ) },

        password : function(cb){ ReqCS.setPassedArguments( req.body.password, cb ) },

        phoneno : function(cb){ ReqCS.setPassedArgumentsStrict( req.body.phoneno, cb ) },

        siteaccess : function(cb){ ReqCS.setPassedArray( req.body.siteaccess, cb ) },

        isactive : function(cb){ ReqCS.setPassedArguments( req.body.isActivate, cb ) },

        customerId : function(cb){ ReqCS.sessionUsersCustomerId( req, cb ) },

        accessKey: function (cb) { ReqCS.sessionUsersCustomerAccessKey(req, cb); },

        user : function(cb){ ReqCS.sessionUser(req, cb);}
    },function(err, requestObject){
        if(!err){
            async.series({
//                validation : function(cb){
//                userService.checkUserExist(requestObject, cb)
//                },
                user : function(cb){
                    userService.edit(requestObject, cb)
                }
            }, function(err, _object){
                var response = {
                    status : err ? 400 : 200,
                    data : "MODIFIED"
                };
                res.send(response)
            });
        }else{
            var response = {
                status : err ? 400 : 200,
                data : err
            };
            res.send(response)
        }
    });
};




/*
 mapsitedetails against Users
 */
var usersitedetails = function(req, res){
    async.parallel ({
        arrayOfUsers : function(cb){ ReqCS.setPassedArguments( req.body.arrayOfUsers, cb ) },
        sitedetails : function(cb){ ReqCS.setPassedArguments( req.body.sitedetails, cb ) },
        user : function(cb){ ReqCS.sessionUser(req, cb);}
    },function(err, requestObject){
        if(!err){
            async.series({
                user : function(cb){
                    userService.usersitedetails(requestObject, cb)
                }
            }, function(err, _object){
                var response = {
                    status : err ? 400 : 200,
                    data : err || "MODIFIED"
                }
                res.send(response)
            });
        }else{
            var response = {
                status : err ? 400 : 200,
                data : err
            }
            res.send(response)
        }
    });
}
/*
Disable Users
 */
var disable = function(req, res){
//    console.log("request .body while disabling",req.body);
    async.parallel({
        user : function(cb){
            ReqCS.sessionUser(req, cb);
        },
//        userId : function(cb){
//            ReqCS.getObjectId(req.body.userId, cb);
//        }
        userIds : function(cb){ ReqCS.getAsObjectIds( req.body, cb ) }
    }, function(err, requestObject){
        async.series({

            role: function (cb) {
                userService.disable(requestObject, cb);
            }
        }, function (err, _object) {
            var response = {
                status: err ? 400 : 200,
                data: err || "DISABLED"
            }
            res.send(response);
        });
    })
};
/* Create Users using GET*/
var createUsingGet = function(req, res){

    async.parallel ({

        emailId : function(cb){ ReqCS.setPassedArgumentsStrict( req.query.emailId, cb ) },

        fullName : function(cb){ ReqCS.setPassedArgumentsStrict( req.query.fullName, cb ) },

        roles : function(cb){ ReqCS.getObjectId( req.query.roles, cb ) },

        customerId : function(cb){ ReqCS.sessionUsersCustomerId( req, cb ) },

        customerAccessKey : function(cb){ ReqCS.sessionUsersCustomerAccessKey( req, cb ) },

        randomPassword : function(cb) { ReqCS.randomAccessCode( req, cb ) }

    },function(err, requestObject){
        if(!err){

            async.series({

                validation : function(cb){
                    userService.checkUserExist(requestObject, cb)
                },
                user : function(cb){
                    userService.createUser(requestObject, cb)
                }

            }, function(err, _object){

                var response = {
                    status : err ? 400 : 200,
                    data : err || _object.user
                }
                res.send(response);

            });


        }else{
            var response = {
                status : err ? 400 : 200,
                data : err
            }
            res.send(response)
        }

    })
};
var editUsingGet = function(req, res){
    async.parallel ({

//        type : function(cb){ ReqCS.setPassedArgumentsStrict( req.query.type, cb ) },
        userId : function(cb){ ReqCS.getObjectId( req.query.userId, cb ) },
        fullName : function(cb){ ReqCS.setPassedArgumentsStrict( req.query.fullName, cb ) },
        roles : function(cb){ ReqCS.getObjectId( req.query.roles, cb ) }
//
//        customerId : function(cb){ ReqCS.sessionUsersCustomerId( req, cb ) },

//        randomPassword : function(cb) { ReqCS.randomAccessCode( req, cb ) }

    },function(err, requestObject){

        if(!err){

            async.series({


                user : function(cb){
                    userService.editUser(requestObject, cb)
                }

            }, function(err, _object){

                var response = {
                    status : err ? 400 : 200,
                    data : err || "MODIFIED"
                }
                res.send(response)

            });


        }else{
            var response = {
                status : err ? 400 : 200,
                data : err
            }
            res.send(response)
        }

    });
}
/*
var login = function(req, res){
var user={};
    async.parallel ({
        username : function(cb){ ReqCS.setPassedArguments( req.query.email, cb ) }
    },function(err, requestObject){
        async.waterfall([
            function (cb) {
                userService.getUser(requestObject,
                    function (err, data) {
                        user = data;
//                        console.log("getting user details............................................", user)
                        if(_.isEmpty(data)) {
                            userService.getRole(user.roleid,
                                function (err, data) {
                                    user.roledetails = data;
//                                    console.log("getting role details............................................", user)
                                    cb();
                                }
                            )
                        }
                        cb();
                    }
                )
            }
            ,
            function (cb) {
                if(user!=null) {    //_.isEmpty(data)&&
                    userService.getRole(user.roleid,
                        function (err, data) {
                            user.roledetails = data;
//                            console.log("getting role details............................................", user)
                            cb();
                        }
                    )
                }
                else {

                }
            }

        ], function (err,data, _object) {
//            console.log("data after waterfall execution.................",err, data);
//            console.log("in function (err, _object) {.................",err, _object);
            !err && (req.session.user = user);
            res.send(user);
        });
    })
};*/

var login = function(req, res){
    userService.getUser(req, function(err, status){
//         console.log("test..........................",err,status);
        if(!err){
            res.send(status);
        }else{
            //console.log("test........111111111111111111111111111..................",err);
            res.send(err)
        }

    });
};

var logout = function(req, res){
    res.clearCookie('user');
    delete req.session.user
    req.session.destroy(function(e){});
    req.session = null // Deletes the cookie.​

};

var editPassword = function(req, res){
    //TODO Edit user's password
    res.send("EDIT USER PASSWORD")
};

var remove = function(req, res){
    async.parallel ({
        users : function(cb){ ReqCS.getAsObjectIds( req.query.users, cb ) }
    },function(err, requestObject){
        if(!err){
            async.series({
                validation : function(cb){
                    userService.removeUser(requestObject, cb)
                }
            }, function(err, _object){
                var response = {
                    status : err ? 400 : 200,
                    data : err || "REMOVED"
                }
                res.send(response);
            });
        }else{
            var response = {
                status : err ? 400 : 200,
                data : err
            }
            res.send(response)
        }
    })
};


var list = function(req, res){
    async.parallel ({
        user : function(cb){
            ReqCS.sessionUser(req, cb);
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        customerAccessKey : function(cb){ ReqCS.
            sessionUsersCustomerAccessKey( req, cb )
        },
        pagination : function(cb) {
            ReqCS.pagination(req, cb)
        }

    },function(err, requestObject){
            async.series({
                list : function(cb){
                    userService.list(requestObject, cb)
                }
            }, function(err, _object){
                var response = {
                    status : err ? 400 : 200,
                    data : err || _object
                };
                res.send(response);

            });
    })
};
var count = function(req, res){
    async.parallel ({
        customerAccessKey : function(cb){ ReqCS.sessionUsersCustomerAccessKey( req, cb ) },
        pagination : function(cb) { ReqCS.pagination(req, cb) }
    },function(err, requestObject){
        async.series({
            count : function(cb){
                userService.count(requestObject, cb)
            }
        }, function(err, _object){
            var response = {
                status : err ? 400 : 200,
                data : err || _object
            };
            res.send(response);
        });
    })
};
var listncount = function(req, res){
    async.parallel ({
        customerAccessKey : function(cb){ ReqCS.sessionUsersCustomerAccessKey( req, cb ) },
        pagination : function(cb) { ReqCS.pagination(req, cb) }

    },function(err, requestObject){
        async.series({
            list : function(cb){
                userService.list(requestObject, cb)
            },
            count : function(cb){
                userService.count(requestObject, cb)
            }
        }, function(err, _object){
            var response = {
                status : err ? 400 : 200,
                data : err || _object
            };
            res.send(response);
        });
    })
};

var listIdText = function(req, res) {
    async.parallel({

        user: function (cb) {
            ReqCS.sessionUser(req, cb)
        },
        pagination: function (cb) {
            ReqCS.pagination(req, cb)
        },
        sort: function (cb) {
            ReqCS.sort(req, cb)
        },
        customerId: function (cb) {
            ReqCS.sessionUsersCustomerId(req, cb);
        },
        accessKey: function (cb) {
            ReqCS.sessionUsersCustomerAccessKey(req, cb);
        }

    }, function (err, requestObject) {

        async.parallel({
            list : function(cb) {
                userService.listIdText(requestObject, cb);
            }
        },function(err, data){
            var response = {
                status: err ? 400 : 200,
                data: err || data,
                meta : {
                    pagination : requestObject.pagination,
                    sort : requestObject.sort
                }
            };
            res.send(response);

        })

    });


};


var register = function(req, res){
    var data = req.body;
    var decrypted = CryptoJS.AES.decrypt(data.password, JSON.stringify(req.session.uniqueID)).toString(CryptoJS.enc.Utf8);
    async.parallel({
        fullname : function(cb) { ReqCS.setPassedArgumentsStrict(data.fullname, cb) },
        password : function(cb) { userService.saltAndHash(decrypted, cb) },
        username : function(cb) { ReqCS.setPassedArgumentsStrict(data.email, cb) },
        phoneno : function(cb) { ReqCS.setPassedArgumentsStrict(data.phoneno, cb) },
        organization : function(cb) { ReqCS.setPassedArgumentsStrict(data.organization, cb) }

    }, function(err, reqObject){
        reqObject.createdTime = new Date().getTime();
        reqObject.isActivate = false;
        reqObject.activationId = randomstring.generate();

//        console.log("role id...............",reqObject.role);

        userService.saveUser(reqObject, function(err, savedObject){
            if(err){
                res.send(500,err);
            } else{
                res.send(200,savedObject);
            }
        });

    });

};

var activate = function(req,res){
    if(req.query.activationId){

        userService.activate(req, function(err, status){
            console.log("ERROR" , err);
            console.log("STATUS" , status);
            if(!err){
                req.session.uniqueID = global.db.ObjectId();
                res.render("index",{status:status,'uniqueID' : req.session.uniqueID});
            }else{
                res.render("useractivationerror",{status:status});
            }

        });
    }else{
        res.redirect("useractivationerror",{message:"Wrong activation id !!!! Please refer to your emaild registered"});
    }

};




var getAccountByEmail = function(req, res){
    var email = req.body.email;

    userService.getAccountByEmail(email,function(o){
        if (o){
            res.send('ok', 200);
            userService.passwordResetEmail(o, function(e, m){
                // this callback takes a moment to return //
                // should add an ajax loader to give user feedback //
                if (!e) {
                    res.send('ok', 200);
                }	else{
                    res.send('email-server-error', 400);
                    for (k in e) console.log('error : ', k, e[k]);
                }
            });
        }	else{
            res.send('email-not-found', 400);
        }

    });
}

var resetPassword = function(req, res) {
    var email = req.query.e;
    var pwdResetId = req.query.pwdResetId;
    var obj = {
        email : email,
        pwdResetId : pwdResetId
    }
    userService.getAccountByEmailPassword(obj,function(o){
        if (o){
            //res.send('ok', 200);
            res.render('resetpassword',{
                'pwdResetId' : pwdResetId,
                'email' : email
            });

        }else{
            res.send('password reset link already used.', 400);
        }

    });
}



var saveResetPassword = function(req , res){
//    console.log(req.body.email,req.body.pwdResetId)
    var email = req.body.email;
    var pwdResetId = req.body.pwdResetId;
    var password = req.body.password;
    var newPassword  = function(cb) {
        userService.saltAndHash(password, cb)
    };

    newPassword(
        function(err, hashPassword){
            console.log(err, hashPassword);
            var obj = {
                email : email,
                pwdResetId : pwdResetId
            }

            userService.getAccountByEmailPassword(obj,function(o){
                if (o){
                    var updateObj = {
                        condition : {
                            email : o.email,
                            pwdResetId : o.pwdResetId
                        },
                        value : { $set : {password : hashPassword,pwdFlag : true} },
                        options : { multi : false, upsert : false }
                    };
                    userService.updateNewPassword(updateObj,function(e, m){

                        // this callback takes a moment to return //
                        // should add an ajax loader to give user feedback //
                        console.log(e, m);
                        if (!e) {
                            res.send('ok', 200);
                        }	else{
                            res.send(' not update', 400);

                        }
                    });

                }

            });


        }
    )

}



module.exports = {
    create : create,
    edit : edit,
    editPassword : editPassword,
    list : list,
    usersitedetails : usersitedetails,
    count : count,
    listncount : listncount,
    remove : remove,
    disable : disable,
    login : login,
    logout : logout,
    listIdText : listIdText,
    validate : validate,
    register:register,
    activate:activate,
    getAccountByEmail :getAccountByEmail,
    resetPassword:resetPassword,
    saveResetPassword : saveResetPassword
};


