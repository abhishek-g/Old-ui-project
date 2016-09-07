/**
 * Created by Sneha on 7/1/15.
 */

define(['angular', 'highcharts-more', 'highcharts-solidgauge', 'angularCarousel'], function (angular) {

    var Directives = angular.module('SolarPulse.AllZones.Directives', ['angular-carousel']);

    Directives.directive('topWidgets4', ['$timeout', function ($timeout) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: "/modules/dashboard/html/partials/all-zones/top-widgets.html",
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    $('.js-username').html(scope.User.user.username);
                });
            }
        };
    }]);

    Directives.directive('allZonesMap', ['$timeout', function ($timeout) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: '/modules/dashboard/html/partials/all-zones/all-zones-map.html',
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    var singleZoneMap = {};
                    singleZoneMap = new google.maps.Map($(elem).find('.js-all-zones-map')[0], mapOptions);
                    var mapOptions = {
                        center: new google.maps.LatLng('12.891418', '80.227747'),
                        zoom: 10, //if satellite : 10,
                        streetViewControl: true,
                        mapTypeId: 'hybrid' //'ROADMAP'//'hybrid'//'TERRAIN'//'satellite'
                    };


                    var watchCallback = scope.$watch("ZoneDetails", function (data) {
                        if (!$.isEmptyObject(data)) {
                            var setZoneMap = [];
                            var zonePolygonMid = null;
                            /*---------------------------start putting each zone into map-----------------------------*/
                            angular.forEach(data, function (data) {

                                var j = 0;
                                var zone = data.location.features[0].geometry.coordinates[0];
                                var zoneCoords = [];
                                for (var i = 0; i < (zone.length); i++) {

                                    zoneCoords.push(new google.maps.LatLng(zone[i][1], zone[i][0]));
                                    singleZoneMap.setOptions({
                                        center: new google.maps.LatLng(zone[i][1], zone[i][0]),
                                        zoom: 17
                                    });
                                }
                                zonePolygonMid = new google.maps.LatLng(data.location.features[1].geometry.coordinates[1], data.location.features[1].geometry.coordinates[0]);
                                var displayContent = "<b>Name :" + data.name + " <br>" +
                                    "Capacity : " + data.meta.capacity.value + " " + data.meta.capacity.unit + " <br>" +
                                    "Alarms : " + data.alarmCount + " <br>" +
                                    "Energy yield : " + data.energyYield.toFixed(2) + "kWh <br>" +
                                    "Last reported time : " + moment(data.lastReportedTime[0].lastReportedTime).format("DD/MM/YYYY HH:mm") + "</b>";

                                var iw = new google.maps.InfoWindow({
                                    position: zonePolygonMid,
                                    content: displayContent // data.name//,//"Zone name",
                                        //                                    labelStyle: {opacity: 0.1}
                                });

                                // Construct the polygon.
                                setZoneMap[j] = new google.maps.Polygon({
                                    paths: zoneCoords,
                                    strokeColor: '#03570A', //'#FD2525',
                                    strokeOpacity: 0.3,
                                    strokeWeight: 3,
                                    fillColor: '#03570A', //'#FD2525',
                                    fillOpacity: 0.1
                                });
                                setZoneMap[j].setMap(singleZoneMap);
                                //                                iw.open(singleZoneMap);
                                google.maps.event.addListener(setZoneMap[j], "click", function (e) {
                                    iw.open(singleZoneMap, this);
                                });
                                j++;
                            });
                            /*---------------------------end of loop which sets zone into maps-----------------------------*/
                            watchCallback();
                        }
                    });

                    $('.js-panel-map').on('click', function () {
                        $timeout(function () {
                            $('.js-map-panel-body').css('height', '637px');
                            google.maps.event.trigger(singleZoneMap, 'resize');
                        });
                    });



                    var siteCoOrds = scope.sitesList[0].children[0].location.features[0].geometry.coordinates[0];
                    var sitePolygonMid = new google.maps.LatLng(scope.sitesList[0].children[0].location.features[1].geometry.coordinates[1], scope.sitesList[0].children[0].location.features[1].geometry.coordinates[0]);
                    var marker = new google.maps.Marker({
                        position: sitePolygonMid,
                        map: singleZoneMap
                    });
                    /*--------------------------start setting site polygon in map------------------------------*/
                    var setSiteMap = [];
                    var siteCoords = [];
                    for (var i = 0; i < (siteCoOrds.length); i++) {
                        siteCoords.push(new google.maps.LatLng(siteCoOrds[i][1], siteCoOrds[i][0]));
                    }
                    // Construct the polygon.
                    setSiteMap = new google.maps.Polygon({
                        paths: siteCoords,
                        strokeColor: '#0000FF', //'#FD2525',
                        strokeOpacity: 0.3,
                        strokeWeight: 3,
                        fillColor: '#0000FF', //'#FD2525',
                        fillOpacity: 0.05
                    });
                    setSiteMap.setMap(singleZoneMap);
                    /*--------------------------------end setting site polygon in map------------------------*/

                });

                $timeout(function () {
                    $(document).resize();
                }, 300);
            }
        };
    }]);

    Directives.directive('solidGauge', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            scope: false,
            template: '<div  class="solid-gauge" style="width: 180px;height:100px;float: left"></div>',
            link: function (scope, elem, attrs) {
                scope.data = [];
                var PostChartopts = {};

                var gaugeOptions = {

                    chart: {
                        type: 'gauge',
                        height: 100
                    },
                    title: {
                        text: 'Daily Yield'
                    },
                    pane: {

                        startAngle: -90,
                        endAngle: 90,
                        size: '125%',
                        background: {
                            backgroundColor: '#eee',
                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }

                        /*  ,
                         background: [{
                         // default background
                         backgroundColor: '#fff',
                         borderWidth: 0
                         }
                         ]*/
                    },

                    tooltip: {
                        enabled: false
                    },

                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 2000,

                        minorTickInterval: 'auto',
                        minorTickWidth: 0,
                        minorTickLength: 0,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',

                        tickPixelInterval: 2000,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 0,
                        tickColor: '#666',
                        labels: {
                            //                            enabled: false
                            //
                            //                            distance: 20,
                            rotation: 0,
                            style: {
                                color: '#000',
                                size: '150%',
                                fontWeight: 'bold'
                                    /*
                                     step: 2,
                                     rotation: 'auto'
                                     */
                            },
                            align: 'center',
                            distance: -5,
                            x: 0,
                            y: 10
                        },
                        title: {
                            text: null // 'kWh'
                        },
                        plotBands: [
                            // /*
                            {
                                from: 0,
                                to: scope.overviewObj['yield'],
                                color: '#a0bf1c', //light green
                                innerRadius: '60%',
                                outerRadius: '95%'
                            },
                            {
                                from: 0,
                                to: 400,
                                innerRadius: '45%',
                                outerRadius: '55%',
                                color: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, 'red'], //'#fff'
                                        [1, 'red'] //yellow  //[1, '#fff']
                                    ]
                                }
                            }, {
                                from: 400,
                                to: 800,
                                innerRadius: '45%',
                                outerRadius: '55%',
                                color: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, 'orange'], //'#fff'
                                        [1, 'orange'] //yellow  //[1, '#fff']
                                    ]
                                }
                            }, {
                                from: 800,
                                to: 1200,
                                innerRadius: '45%',
                                outerRadius: '55%',
                                color: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, 'yellow'], //'#fff'
                                        [1, 'yellow'] //yellow  //[1, '#fff']
                                    ]
                                }
                            }, {
                                from: 1200,
                                to: 1600,
                                innerRadius: '45%',
                                outerRadius: '55%',
                                color: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, '#66FF66'], //'#fff'
                                        [1, '#66FF66'] //'#FFFFCC' - faint yellow  //[1, '#fff']
                                    ]
                                }
                            }, {
                                from: 1600,
                                to: 2000, //value colored where dial stops
                                innerRadius: '45%',
                                outerRadius: '55%',
                                color: 'green' //'#000' // red
                            }]

                    },

                    plotOptions: {
                        gauge: {
                            //css for needle
                            dial: { //these parameters are for the needle
                                baseWidth: 0.4, //thickness of the needle
                                backgroundColor: 'black', //'#C33',
                                borderColor: 'black', //'#900',
                                borderWidth: 0.2,
                                rearLength: 20, //length of the pointer behind its base
                                baseLength: 10,
                                radius: 90 //length of the pointer ahead of its base
                            },
                            //so that data label below does not show
                            dataLabels: {
                                enabled: false
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            data: []
                        }
                    ]
                };

                $(elem).find('.solid-gauge').highcharts(gaugeOptions);
                PostChartopts = $(elem).find('.solid-gauge').highcharts();

                scope.showRefresh = function () {
                    PostChartopts.showLoading();
                };

                var setData = [scope.overviewObj['yield']] <= 0 ? 1 : [scope.overviewObj['yield']];
                PostChartopts.series[0].setData(setData);
                PostChartopts.reflow();
            }
        }
    }]);

    //    Directives.directive('specificPower', ['$timeout', function ($timeout) {
    //        return {
    //            restrict: 'EA',
    //            scope: false,
    //            template: '<div  class="circular-gauge" style="width: 180px;height:100px;float: left"></div>',
    //            link: function (scope, elem, attrs) {
    //                scope.data = [];
    //                var PostChartopts = {};
    //
    //                var gaugeOptions = {
    //
    //                    chart: {
    //                        type: 'gauge',
    //                        height: 100
    //                    },
    //                    title: {
    //                        text: 'Specific power'
    //                    },
    //                    pane: {
    //
    //                        startAngle: -90,
    //                        endAngle:360,
    //                        size: '125%',
    //                        background: {
    //                            backgroundColor:  '#eee',
    //                            innerRadius: '60%',
    //                            outerRadius: '100%',
    //                            shape: 'circle'
    //                        }
    //                    },
    //
    //                    tooltip: {
    //                        enabled: false
    //                    },
    //
    //                    // the value axis
    //                    yAxis: {
    //                        min: 0,
    //                        max: 1,
    //
    //                        minorTickInterval: 'auto',
    //                        minorTickWidth: 0,
    //                        minorTickLength: 0,
    //                        minorTickPosition: 'inside',
    //                        minorTickColor: '#666',
    //
    //                        tickPixelInterval: 2000,
    //                        tickWidth: 2,
    //                        tickPosition: 'inside',
    //                        tickLength: 0,
    //                        tickColor: '#666',
    //                        labels: {
    ////                            enabled: false
    //
    ////                            distance: 20,
    //                            rotation: 0,
    //                            style: {
    //                                color: '#000',
    //                                size: '150%',
    //                                fontWeight: 'bold'
    //                                /*
    //                                 step: 2,
    //                                 rotation: 'auto'
    //                                 */
    //                            },
    //                            align: 'center',
    //                            distance: -5,
    //                            x: 0,
    //                            y: 10
    //                        },
    //                        title: {
    //                            text: null// 'kWh'
    //                        },
    //                        plotBands: [
    //                            // /*
    //                            {
    //                                from: 0,
    //                                to: scope.overviewObj['spPower'],
    //                                color: '#7770a0' ,//violet
    //                                outerRadius: '60%',
    //                                innerRadius: '95%'
    //                            },
    //                            /*
    //                             {
    //                             from: scope.overviewObj['yield'],
    //                             to: 2000,
    //                             color: '#E6E6E6' , //grey
    //                             outerRadius: '60%',
    //                             innerRadius: '75%'
    //                             },
    //                             // */
    //                            {
    //                                from: 0,
    //                                to: 400,
    //                                innerRadius: '1%',
    //                                outerRadius: '55%',
    //                                color: {linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    //                                    stops: [
    //                                        [0, 'red'],//'#fff'
    //                                        [1, 'red']//yellow  //[1, '#fff']
    //                                    ]}
    //                            }]
    //
    //                    },
    //
    //                    plotOptions: {
    //                        gauge: {
    //                            //css for needle
    //                            dial: { //these parameters are for the needle
    //                                baseWidth: 0, //thickness of the needle
    //                                backgroundColor: '#babcbc', //'#C33',
    //                                borderColor: '#babcbc',//'#900',
    //                                borderWidth: 0,
    //                                rearLength: 0,//length of the pointer behind its base
    //                                baseLength: 0,
    //                                radius: 0 //length of the pointer ahead of its base
    //                            },
    //                            //so that data label below does not show
    //                            dataLabels: {
    //                                enabled: false
    //                            }
    //                        }
    //                    },
    //                    credits: {
    //                        enabled: false
    //                    },
    //                    series: [
    //                        {
    //                            data: []
    //                        }
    //                    ]
    //                };
    //
    //                $(elem).find('.circular-gauge').highcharts(gaugeOptions);
    //                PostChartopts = $(elem).find('.circular-gauge').highcharts();
    //
    //                scope.showRefresh = function () {
    //                    PostChartopts.showLoading();
    //                };
    //
    //                var setData = [scope.overviewObj['spPower']] <= 0 ? 1 : [scope.overviewObj['spPower']];
    //                PostChartopts.series[0].setData(setData);
    //                PostChartopts.reflow();
    //            }
    //        }
    //    }]);
    //circularGauge is using solid gauge; not speedometer. For now, it is not being used
    Directives.directive('circularGauge', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            scope: false,
            template: '<div  class="circular-gauge" style="width: 180px;height:100px;float: left"></div>',
            link: function (scope, elem, attrs) {
                scope.data = [];
                var PostChartopts = {};

                var gaugeOptions = {

                    chart: {
                        type: 'solidgauge',
                        height: 100
                    },
                    title: {
                        text: 'Specific Power'
                    },
                    pane: {
                        center: ['50%', '50%'],
                        size: '100%',
                        startAngle: 0,
                        endAngle: 360,
                        background: {
                            backgroundColor: '#eee',
                            innerRadius: '60%',
                            outerRadius: '105%',
                            shape: 'circle'
                        }
                        //                        ,
                        //                        background: {
                        //                            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                        //                            innerRadius: '50%',
                        //                            outerRadius: '110%',
                        //                            shape: 'circle'
                        //                        }
                    },

                    tooltip: {
                        enabled: false
                    },

                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 1,
                        stops: [
                            [0.1, '#7770a0'], // bright violet
                            [0.3, '#7770a0'], // faint violet
                            [0.9, '#7770a0'] // pale violet
                        ],
                        lineWidth: 0,
                        minorTickInterval: null,
                        tickPixelInterval: 400,
                        tickWidth: 0,
                        title: {
                            y: -40
                        },
                        label: false,
                        labels: {
                            enabled: false
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            }
                        }
                    },
                    series: [
                        {
                            data: []
                        }
                    ]
                };

                $(elem).find('.circular-gauge').highcharts(gaugeOptions);
                PostChartopts = $(elem).find('.circular-gauge').highcharts();

                scope.showRefresh = function () {
                    PostChartopts.showLoading();
                };

                PostChartopts.series[0].setData([scope.overviewObj['spPower']]);

            }
        }
    }]);

    Directives.directive('solidGaugeSpYield', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            scope: false,
            template: '<div  class="solid-gauge-sp-yield" style="width: 180px;height:100px;float: left"></div>',
            link: function (scope, elem, attrs) {
                scope.data = [];
                var PostChartopts = {};

                var gaugeOptions = {

                    chart: {
                        type: 'gauge',
                        height: 100
                    },
                    title: {
                        text: 'Specific Yield'
                    },
                    pane: {
                        startAngle: -90,
                        endAngle: 90,
                        size: '125%',
                        background: {
                            backgroundColor: '#eee',
                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                        /*  ,
                         background: [{
                         // default background
                         backgroundColor: '#fff',
                         borderWidth: 0
                         }
                         ]*/
                    },

                    tooltip: {
                        enabled: false
                    },

                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 10,

                        minorTickInterval: 'auto',
                        minorTickWidth: 0,
                        minorTickLength: 0,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',

                        tickPixelInterval: 10000,
                        tickWidth: 0,
                        tickPosition: 'inside',
                        tickLength: 0,
                        tickColor: '#666',
                        labels: {
                            //                            enabled: false

                            //                            distance: 20,
                            rotation: 0,
                            style: {
                                color: '#000',
                                size: '150%',
                                fontWeight: 'bold'
                                    /*
                                     step: 2,
                                     rotation: 'auto'
                                     */
                            },
                            align: 'center',
                            distance: -5,
                            x: 0,
                            y: 10
                        },
                        title: {
                            text: null // 'kWh'
                        },
                        plotBands: [
                            // /*
                            {
                                from: 0,
                                to: scope.overviewObj['spYield'],
                                color: '#705e5b', //dark grey
                                outerRadius: '60%',
                                innerRadius: '95%'
                            }]

                    },

                    plotOptions: {
                        gauge: {
                            //css for needle
                            dial: { //these parameters are for the needle
                                baseWidth: 0.4, //thickness of the needle
                                backgroundColor: 'black', //'#C33',
                                borderColor: 'black', //'#900',
                                borderWidth: 0.2,
                                rearLength: 20, //length of the pointer behind its base
                                baseLength: 10,
                                radius: 90 //length of the pointer ahead of its base
                            },
                            //so that data label below does not show
                            dataLabels: {
                                enabled: false
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            data: []
                        }
                    ]
                };

                $(elem).find('.solid-gauge-sp-yield').highcharts(gaugeOptions);
                PostChartopts = $(elem).find('.solid-gauge-sp-yield').highcharts();

                scope.showRefresh = function () {
                    PostChartopts.showLoading();
                };

                var setData = [scope.overviewObj['spYield']] <= 0 ? 1 : [scope.overviewObj['spYield']];
                PostChartopts.series[0].setData(setData);
                PostChartopts.reflow();
            }
        }
    }]);

    //    Directives.directive('solidGauge', ['$timeout', function ($timeout) {
    //        return {
    //            restrict: 'EA',
    //            scope: false,
    //            template: '<div  class="solid-gauge" style="width: 120px;height:100px;float: left"></div>',
    //            link: function (scope, elem, attrs) {
    //                scope.data = [];
    //                var PostChartopts = {};
    //
    //                var gaugeOptions = {
    //
    //                    chart: {
    //                        type: 'solidgauge',
    //                        height: 100
    //                    },
    //                    title: {
    //                        text: 'Solid Gauge'
    //                    },
    //                    pane: {
    //                        center: ['50%', '50%'],
    //                        size: '100%',
    //                        startAngle: -90,
    //                        endAngle: 90,
    //                        background: {
    //                            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
    //                            innerRadius: '60%',
    //                            outerRadius: '100%',
    //                            shape: 'arc'
    //                        }
    //                    },
    //
    //                    tooltip: {
    //                        enabled: false
    //                    },
    //
    //                    // the value axis
    //                    yAxis: {
    //                        min: 0,
    //                        max: 2000,
    //                        stops: [
    ////                            [0.1, '#DF5353'], // red
    ////                            [0.3, '#DDDF0D'], // yellow
    ////                            [0.9, '#55BF3B'] // green
    //                            [0.1, '#63A143'], //  green
    //                            [0.3, '#63A143'], //  green
    //                            [0.9, '#63A143'] //  green
    //                        ],
    //                        lineWidth: 0,
    //                        minorTickInterval: null,
    //                        tickPixelInterval: 400,
    //                        tickWidth: 0,
    //                        title: {
    //                            y: -40
    //                        },
    //                        labels: {
    //                            enabled: true,
    //                            align: 'center',
    //                            distance: -5,
    //                            x: 0,
    //                            y: 10
    //                        }
    //                    },
    //                    credits: {
    //                        enabled: false
    //                    },
    //                    plotOptions: {
    //                        solidgauge: {
    //                            dataLabels: {
    //                                enabled: false
    //                            }
    //                        }
    //                    },
    //                    series: [
    //                        {
    //                            data: []
    //
    //                        }
    //                    ]
    //                };
    //
    //                $(elem).find('.solid-gauge').highcharts(gaugeOptions);
    //                PostChartopts = $(elem).find('.solid-gauge').highcharts();
    //
    //                scope.showRefresh = function () {
    //                    PostChartopts.showLoading();
    //                };
    //
    //                var setData = [scope.overviewObj['yield']] <= 0 ? 1 : [scope.overviewObj['yield']];
    //                PostChartopts.series[0].setData(setData);
    //                PostChartopts.reflow();
    //            }
    //        }
    //    }]);

    //    Directives.directive('solidGaugeSpPower', ['$timeout', function ($timeout) {
    //        return {
    //            restrict: 'EA',
    //            scope: false,
    //            template: '<div  class="solid-gauge-sp-power" style="width: 180px;height:100px;float: left"></div>',
    //            link: function (scope, elem, attrs) {
    //                //                alert(attrs['data']);
    //
    //                scope.data = [];
    //                var PostChartopts = {};
    //
    //                var gaugeOptions = {
    //
    //                    chart: {
    //                        type: 'solidgauge',
    //                        height: 100
    //                    },
    //                    title: {
    //                        text: 'Solid Gauge'
    //                    },
    //                    pane: {
    //                        center: ['50%', '50%'],
    //                        size: '100%',
    //                        startAngle: -90,
    //                        endAngle: 90,
    //                        background: {
    //                            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
    //                            innerRadius: '60%',
    //                            outerRadius: '100%',
    //                            shape: 'arc'
    //                        }
    //                    },
    //
    //                    tooltip: {
    //                        enabled: false
    //                    },
    //
    //                    // the value axis
    //                    yAxis: {
    //                        min: 0,
    //                        max: 10,
    //                        stops: [
    //                            [0.1, '#705e5b'], //
    //                            [0.3, '#705e5b'], //
    //                            [0.9, '#705e5b'] //
    //                        ],
    //                        lineWidth: 0,
    //                        minorTickInterval: null,
    //                        tickPixelInterval: 400,
    //                        tickWidth: 0,
    //                        title: {
    //                            y: -40
    //                        },
    //                        label: false,
    //                        labels: {
    //                            enabled: true,
    //                            align: 'center',
    //                            distance: -5,
    //                            x: 0,
    //                            y: 10
    //                        }
    //                    },
    //                    credits: {
    //                        enabled: false
    //                    },
    //                    plotOptions: {
    //                        solidgauge: {
    //                            dataLabels: {
    //                                enabled: false
    //                            }
    //                        }
    //                    },
    //                    series: [
    //                        {
    //                            data: []
    //                        }
    //                    ]
    //                };
    //
    //                $(elem).find('.solid-gauge-sp-power').highcharts(gaugeOptions);
    //                PostChartopts = $(elem).find('.solid-gauge-sp-power').highcharts();
    //
    //                scope.showRefresh = function () {
    //                    PostChartopts.showLoading();
    //                };
    //
    //                PostChartopts.series[0].setData([scope.overviewObj['spYield']]);
    //
    //            }
    //        }
    //    }]);

    return Directives;
});