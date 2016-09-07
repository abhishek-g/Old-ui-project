/**
 * Created by abhishekgoray on 11/26/14.
 */

define(['angular','underscore','aes'] , function(angular,_){
    "use strict";

    var Services = angular.module("SolarPulse.Login.Services",[]);

    Services.factory("LoginService",['Ajaxutility','UrlRepository','$q',function(Ajaxutility,UrlRepository,$q){
        return {
            authenticateUser : function(User){
                var deferred = $q.defer();

                var password = this.encryptPassword(User.password,User.uniqueID).toString();

                Ajaxutility.sendRequest({
                    url:UrlRepository.checkUser,
                    data:{
                        username:User.email,
                        password:password
                    },
                    method: 'POST',
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                },function(res){
                    deferred.resolve(res)
                },function(err){
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            encryptPassword : function(password,uniqueId){

                var encryptedPassword = CryptoJS.AES.encrypt(password, uniqueId.toString());

                return encryptedPassword;
            }
        };
    }]);

    return Services;

});