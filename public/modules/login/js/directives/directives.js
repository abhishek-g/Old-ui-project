/**
 * Created by abhishekgoray on 11/26/14.
 */


define(['angular','jquery-validate'], function (angular) {
    "use strict";

    var Directives = angular.module('SolarPulse.Login.Directives',[]);

    Directives.directive("formLogin", ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            //replace:true,
            scope: {
                'logincallback':'&logincallback',
                'error':'='
            },
            templateUrl: '/modules/login/html/partial/login-form.html',
            link: function (scope, elem, attrs) {

                $timeout(function(){
                    /*$('.js-SignIn').on('click' , function(){
                        if($("#jvalidate").valid()){
                            scope.User.uniqueID = $('#uniqueID').val();
                            scope.logincallback({
                                User:scope.User
                            });
                        }
                    });*/
                    $( "#jvalidate" ).submit(function( event ) {
                        scope.User.uniqueID = $('#uniqueID').val();
                        scope.logincallback({
                            User:scope.User
                        });
                    });
                   /* var jvalidate = $("#jvalidate").validate({
                        ignore: [],
                        rules: {
                            email: {
                                required: true,
                                email:true,
                                minlength: 2,
                                maxlength: 50
                            },
                            password: {
                                required: true,
                                minlength: 5,
                                maxlength: 14
                            }
                        }
                    });*/

                });

                scope.$on("error",function(context,val){
                    if(val){
                        $('.js-message-text').css('display','block');
                      //  $('.js-message-text').html("Username or Password does not exist");
                    }
                });


            }
        }
    }]);


    Directives.directive("pageList", ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            //replace:true,
            templateUrl: '/modules/login/html/partial/pagelist.html',
            link: function (scope, elem, attrs) {
                $timeout(function(){
                    $(".owl-carousel").owlCarousel({mouseDrag: false, touchDrag: true, slideSpeed: 300, paginationSpeed: 400, singleItem: true, navigation: false,autoPlay: true});

                    $('body').bind('click', function(e) {
                        if(jQuery(e.target).closest('.navbar-form').length == 0) {
                            // click happened outside of .navbar, so hide
                            var opened = jQuery('.nav-collapse').hasClass('collapse in');
                            if ( opened === true ) {
                                jQuery('.nav-collapse').collapse('hide');
                            }
                        }
                        if(jQuery(e.target).closest('.pagelink').length == 0) {
                            // click happened outside of .navbar, so hide
                            var opened = jQuery('#nav-collapse3').hasClass('collapse in');
                            if ( opened === true ) {
                                jQuery('#nav-collapse3').collapse('hide');
                            }
                        }

                    });

                    $(".icheckbox").iCheck(
                        {
                            checkboxClass: 'icheckbox_minimal-grey',
                            labelHover: true,
                            labelHoverClass: 'active'
                        });
                    $("#homecheck").iCheck('check');
                    $('input.icheckbox').on('ifClicked', function(event){
                        $(".icheckbox").iCheck('uncheck');
                        $(this).iCheck('check');
                        console.log($(this).attr('data-index'));
                        var index=$(this).attr('data-index');
                        $("#nav-collapse3 .alert:nth-child("+index+")").click();
                    });


                    $("#contactpage #location-mumbai").height($( document ).height());



                    /*map for about us page*/

                    var aboutmap={};
                    var markers=[];
                    var mapOptions = {
                        center: { lat:17.4649856, lng: 78.4062792},
                        zoom: 5,
                        disableDefaultUI: true
                    };

                    var places = [
                        ['Mumbai',18.9750,72.8258,2],
                        ['Bangalore',12.9667,77.5667]
                        //['Chennai',13.0827,80.2707,1],
                    ];

                    var markerImage={
                        url:  "/modules/login/images/icons/Blue_marker.png",
                        scaledSize: new google.maps.Size(50, 50) // scaled size

                    }
                    var bluemarkerImage= {
                        url: "/modules/login/images/icons/Blue_Glow_marker.png",
                        scaledSize: new google.maps.Size(50, 50) // scaled size
                    }
                    var redmarkerImage= {
                        url: "/modules/login/images/icons/RED_marker.png",
                        scaledSize: new google.maps.Size(50, 50) // scaled size
                    }


                    function setMarkers(map,locations){

                        for (var i = 0; i < locations.length; i++) {
                            var location = locations[i];
                            var myLatLng = new google.maps.LatLng(location[1], location[2]);
                            markers[i] = new google.maps.Marker({
                                position: myLatLng,
                                map: aboutmap,
                                icon:markerImage,
                                title: location[0],
                                zIndex: location[3]
                            });
                            markers[0].setIcon(redmarkerImage);
                            (function(i) {
                                /*google.maps.event.addListener(markers[i], 'mouseover', function() {
                                    markers[i].setIcon(redmarkerImage);
                                });*/
                                google.maps.event.addListener(markers[i], 'click', function() {
                                    for (var j = 0; j < locations.length; j++) {
                                        markers[j].setIcon(markerImage);
                                    }
                                    markers[i].setIcon(redmarkerImage);
                                    $('.address').hide();
                                    $('#address'+i).show('medium');
                                });

                              /*  google.maps.event.addListener(markers[i], 'mouseout', function() {
                                    markers[i].setIcon(markerImage);
                                });*/

                            })(i);
                            //markers.push(marker);

                        }

                    }

                    $('#nav-collapse3 .alert').click(function(){
                        $('.pages').css('display','none');
                        $($(this).attr('data-target')).show('medium');
                        $(this).parent().find('div').removeClass('active');
                        $(this).addClass('active');

                        if($(this).attr('data-target') == '#contactpage'){

                            aboutmap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                            setMarkers(aboutmap, places);
                        }
                    })






                });
            }
        }
    }]);

    return Directives;

});