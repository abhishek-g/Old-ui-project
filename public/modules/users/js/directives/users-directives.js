/**
 * Created by abhishekgoray on 4/6/15.
 */

define(function (require) {

    var angular = require('angular');
    require('datatables');
    require('bootstrap');
    require('bootstrap-picker');
    var moment = require('moment');

    var Directives = angular.module('SolarPulse.Users.Directives', []);

    Directives.directive("usersTable", ['$timeout','Users',function ($timeout,Users) {
        return{
            restrict: "EA",
            scope: false,
            template: "",
            link: function (scope, elem, attrs) {
                var oTable = {}, TableApi = {} , rowToUpdate={} , rowstoDelete={};
                var columnsOpts = [{
                    targets: [0],
                    sWidth: '2%',
                    mData:"_id",
                    orderable:false,
                    render : function(a,b,c){
                        return "<span class='theme-box-de-selected js-select-icon' data-user-id='"+ a +"'> </span>";
                    }

                },{
                    targets: [1],
                    sWidth: '2%',
                    mData:"_id",
                    orderable:false,
                    render : function(a,b,c){
                        return "<span class='theme-edit-grey-icon js-edit-icon' data-toggle='modal' data-target='#userModal' data-action='edit' data-user-id='"+ a +"'> </span>";
                    }
                },{
                    targets: [2],
                    sWidth: '16%',
                    mData: 'fullname'
                },{
                    targets: [3],
                    sWidth: '16%',
                    mData: 'username'
                },{
                    targets: [4],
                    sWidth: '16%',
                    mData: 'isActivate'
                },{
                    targets: [5],
                    sWidth: '16%',
                    mData: 'phoneno'
                },{
                    targets: [6],
                    sWidth: '18%',
                    mData: 'created.created_ts',
                    render : function(a,b,c){
                        return moment(a).format("DD-MMM-YYYY : HH:mm");
                    }
                },{
                    targets: [7],
                    sWidth: '18%',
                    mData: 'created.created_by_name'

                }];


                scope.addUserToTable = function(data){
                    TableApi.rows.add([scope.User]).draw();
                };

                scope.editUserInTable = function(){
                    oTable.fnUpdate(scope.User,rowToUpdate );
                };

                scope.deleteUsersFromTable = function(){

                    angular.forEach(rowstoDelete,function(row){
                        oTable.fnUpdate("false",row,4);
                    });


                    removeChecks();
                };

                scope.cancelDelete = function(){
                    scope.toDelUsers=[];
                    removeChecks();
                };

                function removeChecks(){
                    var checkedBoxes = $('.theme-box-selected');
                    checkedBoxes.each(function(){
                        $(this).toggleClass('theme-box-selected').toggleClass('theme-box-de-selected');
                    });
                }


                $timeout(function () {

                    oTable = $('#js-users-table').dataTable({"columnDefs": columnsOpts ,
                    "fnRowCallback":function(row,aData){
                        $(row).attr('user-id',aData['_id']);
                    },
                        "pageLength":25,
                        "responsive":true
                    });

                    TableApi = oTable.DataTable();

                    $('.selectpicker').selectpicker().on('change' , function(e){
                        var selectedSite = $(this).selectpicker('val');

                        var alreadyPresent = _.find(scope.selectedSites,function(id){
                            return id === selectedSite;
                        });
                        if(!alreadyPresent){
                            scope.selectedSites.push(selectedSite);
                            scope.$apply();
                        }
                    });

                    $('.js-isActive.js-select-icon').on('click' , function(){
                        scope.User.isActivate = !scope.User.isActivate;
                        scope.$apply();
                    });


                    $(document).resize();

                    scope.$watch('users',function(data){



                        if(data && data.length > 0){
                            TableApi.rows.add(data).draw();

                            $("#js-users-table tbody tr td .js-select-icon").on('click', function (e) {
                                $(this).toggleClass('theme-box-de-selected').toggleClass('theme-box-selected');
                                var clickedId = $(this).data('user-id');
                                var alreadyPresent = _.find(scope.toDelUsers,function(id){
                                    return id === clickedId;
                                });
                                if(!alreadyPresent){
                                    scope.toDelUsers.push(clickedId);
                                    rowstoDelete[clickedId] = $(this).parents('tr')[0];
                                }
                                else{
                                    scope.toDelUsers = _.difference(scope.toDelUsers,[alreadyPresent]);
                                    rowstoDelete[clickedId] = {};
                                }

                                console.log("toDelUsers" , scope.toDelUsers);
                                if(scope.toDelUsers.length>0)
                                    $('#js-delete-button').attr('disabled',false);
                                else{
                                    $('#js-delete-button').attr('disabled',true);
                                }
                            });

                            $('#userModal').on('show.bs.modal' , function(e){
                                if($(e.relatedTarget).data('action') !== 'create'){
                                    scope.User = Users.get($(e.relatedTarget).data('user-id'));
                                    scope.mode = 'edit';
                                    scope.User.confirmPassword = scope.User.password;
                                    scope.$apply();
                                    rowToUpdate = $(e.relatedTarget).parents('tr')[0];
                                }else{
                                    scope.mode = 'create';
                                    scope.$apply();
                                }
                            });

                            $('.theme-delete-button').on('click',function () {
                                console.log("toDelUsers in delete functionality" , scope.toDelUsers);
                                scope.deleteUser();
                            });
                        }
                    })

                });
            }
        }
    }]);

    Directives.directive("compareTo",['$timeout',function(){
        return {
            restrict : "A",
            require: "ngModel",
            scope:{
                otherModelValue: "=compareTo"
            },
            template:"",
            link : function(scope,elem,attrs,ngModel){
                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        }
    }]);

    Directives.directive('disableChildren', function() {
        return {
            require: '^form',
            restrict: 'A',
            link: function(scope, element, attrs,form) {
                var control;

                scope.$watch(function() {
                    return scope.$eval(attrs.disableChildren);
                }, function(value) {
                    if (!control) {
                        control = form[element.find("input").attr("name")];
                    }
                    if (value === false) {
                        form.$addControl(control);
                        angular.forEach(control.$error, function(validity, validationToken) {
                            form.$setValidity(validationToken, !validity, control);
                        });
                    } else {
                        control.$valid=true;
                        form.$removeControl(control);
                    }
                });
            }
        }
    });


    return Directives;
});