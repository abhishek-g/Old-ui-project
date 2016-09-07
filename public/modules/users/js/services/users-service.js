/**
 * Created by abhishekgoray on 4/6/15.
 */

define(function (require) {
    var angular = require('angular');

    var Services = angular.module("SolarPulse.Users.Services", []);

    Services.factory("Users",function(){
        this.users=[];
        var self = this;
        return {
            addToList:function(id,data){
                self.users[id] = data;
            },
            get : function(id){
                return _.find(self.users , function(user){
                    return user['_id'] === id;
                });
            },
            getList : function(data){
                self.users = data;
                return self.users;
            },
            setIsActivate : function(){

            },
            deleteFromList : function(ids){

                angular.forEach(ids,function(id){
                    var User =  _.find(self.users , function(user){
                        return user['_id'] === id;
                    });
                    User.isActivate = false;
                });

            }
        }
    });

    Services.service("UsersService", ['Ajaxutility', 'UrlRepository', '$q', function (Ajaxutility, UrlRepository, $q) {
        return {
            getUsersList: function () {

                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.admin("users").list,
                    method: 'GET',
//                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                },function(res){
                    deferred.resolve(res.data);
                },function(err){
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            addUser: function (data) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.admin("users").add,
                    method: 'POST',
                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                },function(res){
                    deferred.resolve(res);
                },function(err){
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            editUser: function (data) {
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.admin("users").edit,
                    method: 'POST',
                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                },function(res){
                    deferred.resolve(res);
                },function(err){
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            deleteUser: function (data) {
                console.log("..................................................................data in uswer service to delete",data);
                var deferred = $q.defer();

                Ajaxutility.sendRequest({
                    url: UrlRepository.admin("users").delete,
                    method: 'POST',
                    data: data,
                    accepts: {
                        "Content-Type": "application/json",
                        "dataType": "json"
                    }
                },function(res){
                    deferred.resolve(res);
                },function(err){
                    deferred.reject(err);
                });

                return deferred.promise;
            }
        }
    }]);

    return Services;
});