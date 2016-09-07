/**
 * Created by abhishekgoray on 11/27/14.
 */

define(['angular', 'dtPicker', 'angularTree'], function (angular, dtPicker) {
    "use strict";

    var Directives = angular.module('SolarPulse.Home.Directives', ['angularTreeview']);

    Directives.directive("globalDatePicker", ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        return {
            restrict: "A",
            scope: false,
            template: '<input type="text" class="form-control" id="datePicker"></div>',
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    var $elem = $(elem).find('#datePicker');
                    $elem.val(moment().format('DD/MM/YYYY'));
                    $elem.datepicker({
                        autoclose: true,
                        format: 'dd/mm/yyyy',
                        startDate: new Date(moment().subtract(5, 'months').format("DD/MM/YYYY")),
                        endDate: new Date(),
                        todayHighlight: true
                    })
                        .on('changeDate', function (e) {
                            $rootScope.$broadcast("dateChanged", e.date);
                        });
                });
            }
        }
    }]);

    Directives.directive("pageSidebar", ['$timeout', '$location', function ($timeout, $location) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: "/modules/home/html/partials/page-sidebar.html",
            link: function (scope, elem, attrs) {

                var path = $location.path();
//                /* will remove openable class from the menu list , when url is /alarms
//                 *@Author : Pratik */
//                var urlpath = path.substr(1, path.length);
//
//                if (urlpath === 'dashboard') {
//                    $("#allsites").addClass('xn-openable');
//                }else{
//                    $('#scrolz').remove();
//                }

                $timeout(function () {

                    $(".x-navigation li").on('click', function (ev) {
                        ev.stopPropagation();
                        var li = $(this);

                        if(li.find('ul').length > 0 || li.data('state') === "dashboard"){
                            console.log("CALLED");
                            if(li.hasClass('active')){
                                li.removeClass('active');
                            }else{
                                li.addClass('active');
                            }
                        }
                    });

                    $(".x-navigation  li > a").click(function(){

                        var li = $(this).parent('li');
                        var ul = li.parent("ul");

                        ul.find(" > li").not(li).removeClass("active");

                    });

                }, 200);
            }
        };
    }]);

    Directives.directive("messenger", ['$compile', '$timeout', function ($compile, $timeout) {
        return {
            restrict: "EA",
            scope: {
                'message': "=",
                'messagetext': "="
            },
            template: "",
            link: function (scope, elem, attrs) {

                var successMessage = $compile('<div class="alert alert-success" role="alert" >' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span>' +
                    '<span class="sr-only">Close</span></button>{{messagetext}}</div>');

                var errorMessage = $compile('<div class="alert alert-error" role="alert" >' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span>' +
                    '<span class="sr-only">Close</span></button>{{messagetext}}</div>');


                scope.$watch('message', function (val) {
                    if (val == 'S') {
                        elem.append(successMessage(scope));

                        $timeout(function () {
                            elem.find('.alert').remove();
                        }, 6000);

                    } else if (val === 'E') {
                        elem.append(errorMessage(scope));

                        elem.addClass('blink_me');

                        $timeout(function () {
                            elem.find('.alert').remove();
                            elem.removeClass('blink_me');
                        }, 6000);

                    } else if (val == 'W') {
                        elem.append("");
                    }
                });
            }
        }
    }]);

    return Directives;
});