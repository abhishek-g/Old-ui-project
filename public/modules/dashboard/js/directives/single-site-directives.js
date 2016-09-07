/**
 * Created by abhishekgoray on 12/18/14.
 */
define(['angular', 'moment', 'underscore','./../../../../stack/base/basechart.js', 'angularCarousel', 'datatables', './../../../../libs/tableExport/table-export.js'], function (angular, moment, _ , BaseChart) {
    "use strict";

    var singleSiteDirectives = angular.module('SolarPulse.SingleSite.Directives', ['angular-carousel']);

    singleSiteDirectives.directive('singleSiteMap', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="js-single-site-map" style="height: 100%;width:100%"></div>',
                link: function (scope, elem, attrs) {
                    var singleSiteMap = {};
                    var marker;
                    $timeout(function () {
                        $('.page-content-wrap > .theme-loader').hide();

                        var mapOptions = {
                            center: new google.maps.LatLng('12.891418', '80.227747'),
                            zoom: 15,
                            streetViewControl: true
                        };

                        singleSiteMap = new google.maps.Map($(elem).find('.js-single-site-map')[0], mapOptions);


                        var stopWatching = scope.$watch("SiteDetails", function (data) {
                            if (data && data.sites && data.sites.length > 0) {
                                var site = data.sites[0];
                                if (marker) {
                                    marker.setMap(null);

                                    marker = new google.maps.Marker({
                                        map: singleSiteMap,
                                        animation: google.maps.Animation.DROP,
                                        position: new google.maps.LatLng(site['latlng'][0], site['latlng'][1]),
                                        title: site.siteName
                                    });
                                } else {

                                    marker = new google.maps.Marker({
                                        map: singleSiteMap,
                                        animation: google.maps.Animation.DROP,
                                        position: new google.maps.LatLng(site['latlng'][0], site['latlng'][1]),
                                        title: site.siteName
                                    });
                                }
                                scope.isMarkerReady = true;
                                google.maps.event.trigger(singleSiteMap, 'resize');
                                singleSiteMap.setCenter(marker.getPosition());
                                $(document).resize();

                                google.maps.event.addListenerOnce(singleSiteMap, 'idle', resize);
                                stopWatching();

                            }


                            /*---------------------------start putting each zone into map-----------------------------*/
                            var setZoneMap = [];
                            var zonePolygonMid = null;
                            //                            var zoneCoOrds = scope.sitesList[0].children[0].location.features[0].geometry.coordinates[0];
                            angular.forEach(scope.sitesList[0].children[0].children[0].children, function (data) {

                                // console.log("each zone....................", data);


                                var j = 0;
                                var zone = data.location.features[0].geometry.coordinates[0];
                                var zoneCoords = [];
                                for (var i = 0; i < (zone.length); i++) {

                                    zoneCoords.push(new google.maps.LatLng(zone[i][1], zone[i][0]));
                                    singleSiteMap.setOptions({
                                        center: new google.maps.LatLng(zone[i][1], zone[i][0]),
                                        zoom: 16
                                    });
                                }
                                zonePolygonMid = new google.maps.LatLng(data.location.features[1].geometry.coordinates[1], data.location.features[1].geometry.coordinates[0]);
                                var displayContent = "<b>Name :" + data.label + "</b> <br>" +
                                    "<b>Capacity : " + data.meta.capacity.value + " " + data.meta.capacity.unit + "</b><br>";
                                var iw = new google.maps.InfoWindow({
                                    position: zonePolygonMid,
                                    content: displayContent
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
                                setZoneMap[j].setMap(singleSiteMap);
                                //                                iw.open(singleZoneMap);
                                google.maps.event.addListener(setZoneMap[j], "click", function (e) {
                                    iw.open(singleSiteMap, this);
                                });
                                j++;
                            });
                            /*---------------------------end of loop which sets zone into maps-----------------------------*/








                        });

                        $('.js-panel-map').on('click', function () {
                            $timeout(function () {
                                $('.js-map-panel-body').css('height', '374px');
                                google.maps.event.trigger(singleSiteMap, 'resize');
                            });
                        });

                        var siteCoOrds = scope.sitesList[0].children[0].location.features[0].geometry.coordinates[0];

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
                            fillOpacity: 0.1
                        });
                        setSiteMap.setMap(singleSiteMap);
                        /*--------------------------------end setting site polygon in map------------------------*/


                    });

                    function resize() {
                        $(document).resize();
                        google.maps.event.trigger(singleSiteMap, 'resize');
                        singleSiteMap.setCenter(marker.getPosition());
                    }
                }
            }
        }]);

    singleSiteDirectives.directive('singleSiteWeatherInfo', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                templateUrl: '/modules/dashboard/html/partials/single-site-weather-info.html',
                link: function (scope, elem, attrs) {}
            }
        }]);

    singleSiteDirectives.directive("inverterModAmbTemp", ['$timeout', 'ToolTipDateFormatter', function ($timeout, ToolTipDateFormatter) {
        return {
            restrict: "A",
            scope: false,
            template: "<div class='js-mod-amb-temp'></div>",
            link: function (scope, elem, attrs) {
                var $elem = $('.js-mod-amb-temp');
                var PostChart = {};

                scope.showLoading = function () {
                    if (!$.isEmptyObject(PostChart)) {
                        PostChart.showLoading();
                    }
                };

                scope.hideLoading = function () {
                    if (!$.isEmptyObject(PostChart)) {
                        PostChart.hideLoading();
                    }
                };

                var chartOpts = {
                    chart: {
                        type: 'spline',
                        zoomType: 'xy'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: "Ambient Temperature vs Module Temperature"
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                radius: 3
                            }
                        },
                        column: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            formatter: function () {
                                /*if (scope.viewMode === "live") {*/
                                return moment(this.value).format(ToolTipDateFormatter[scope.viewMode]);
                                //}
                            }
                        },
                        startOnTick: true,
                        endOnTick: true,
                        showLastLabel: true
                    },
                    legend: {
                        floating: false,
                        align: 'center',
                        layout: 'horizontal',
                        verticalAlign: 'bottom',
                        symbolRadius: 5,
                        symbolWidth: 12
                            /*y: 8,
                            x: 60*/
                    },
                    yAxis: {
                        title: {
                            text: "Temperature",
                            style: {
                                "font-family": "Roboto-Medium"
                            }
                        },
                        labels: {
                            format: '{value}°C'
                        },
                        min: 0
                    },
                    exporting: {
                        csv: {
                            dateFormat: "%c"
                        }
                    },
                    tooltip: {
                        shared: true,
                        backgroundColor: null,
                        useHTML: true,
                        borderWidth: 0,
                        style: {
                            padding: 0
                        },
                        formatter: function () {
                            var str = "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[scope.viewMode]) + " </b></p>";
                            angular.forEach(this.points, function (point) {
                                str += "<b><p class='valuespan'>" + point.y.toFixed(1) + " ℃</b></p><p class='titlespan'>" + point.series.name + "</p>";
                            });
                            return str;
                        }
                    },
                    series: []
                };

                $timeout(function () {

                    $elem.highcharts(chartOpts);
                    PostChart = $elem.highcharts();
                    /* Zoom reset Code */
                    function resetChartZoom() {
                        PostChart.zoomOut();
                    }
                    $('#resetZoomAMB').click(function () {
                        resetChartZoom();
                    });
                    /* Zoom reset Code Ends*/
                    PostChart.showLoading();

                    scope.$watch('modAmbData', function (data) {
                        PostChart = new Highcharts.Chart(chartOpts);
                        if (data.length > 0) {
                            angular.forEach(data, function (datum, index) {
                                for (var i = 0; i < datum.totalVal.length; i++) {
                                    // console.log('JSON data' + JSON.stringify(datum))
                                    PostChart.addSeries({
                                        name: datum.name + " (" + datum.deviceSn + ")",
                                        data: datum.totalVal[i]
                                    })
                                }

                            });
                            $('#js-hideshow-moduleambienttemp').click(function () {
                                $('#js-hideshow-moduleambienttemp').toggleClass('theme-showeye').toggleClass('theme-hideeye');
                                if (scope.hideShowVal === "HideAll") {
                                    scope.hideShowVal = "ShowAll";
                                    for (var i = 0; i < PostChart.series.length; i++) {
                                        PostChart.series[i].hide();
                                    }
                                } else {
                                    scope.hideShowVal = "HideAll";
                                    for (var i = 0; i < PostChart.series.length; i++) {
                                        PostChart.series[i].show();
                                    }
                                }
                            });
                            PostChart.hideLoading();
                        }
                    });
                });
            }
        }
    }]);

    singleSiteDirectives.directive('singleSiteAlarms', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                templateUrl: '/modules/dashboard/html/partials/single-site/single-site-alarms.html',
                link: function (scope, elem, attrs) {}
            }
    }]);

    singleSiteDirectives.directive('singleSitePoaVsAp', ['$timeout', 'ToolTipDateFormatter',
        function ($timeout, ToolTipDateFormatter) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-poa-vs-ap"></div>',
                link: function (scope, elem, attrs) {
                    var poaVsApGraph = {};
                    var viewmode = scope.viewMode;
//                    var ChartOpts = {
//                        chart: {
//                            zoomType: 'xy'
//                        },
//                        credits: {
//                            enabled: false
//                        },
//                        title: {
//                            text: 'POA vs Active Power (W/m2 vs kW)'
//                        },
//                        xAxis: {
//                            type: 'datetime',
//                            labels: {
//                                overflow: 'justify',
//                                formatter: function () {
//                                    return moment(this.value).format(ToolTipDateFormatter[viewmode]);
//                                },
//                                style: {
//                                    'font-size': '8pt',
//                                    'color': "#000000"
//                                }
//                            }
//                        },
//                        yAxis: [
//                            {
//                                title: {
//                                    text: "Active Power    (kW)",
//                                    style: {
//                                        'color': "#000"
//                                    }
//                                },
//                                labels: {
//                                    style: {
//                                        "color": "#5472ce",
//                                        "font-family": "Roboto-Medium",
//                                        "font-size": "10pt"
//                                    }
//                                },
//                                min: 0
//                            },
//                            {
//                                title: {
//                                    text: "Irradiance    (W/m2)",
//                                    style: {
//                                        'color': "#000"
//                                    }
//                                },
//                                labels: {
//                                    style: {
//                                        "color": "#b24350",
//                                        "font-family": "Roboto-Medium",
//                                        "font-size": "10pt"
//                                    }
//                                },
//                                opposite: true,
//                                min: 0
//                            }
//                        ],
//                        plotOptions: {
//                            area: {
//                                fillOpacity: 0.8,
//                                lineWidth: 1,
//                                marker: {
//                                    enabled: false,
//                                    radius: 2
//                                }
//                            }
//
//                        },
//                        tooltip: {
//                            shared: true,
//                            backgroundColor: null,
//                            useHTML: true,
//                            borderWidth: 0,
//                            style: {
//                                padding: 0
//                            },
//                            formatter: function () {
//                                var str = "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + "</b></p>";
//                                angular.forEach(this.points, function (point) {
//                                    str += "<p class='valuespan'><b>" + point.y.toFixed(1) + " " + point.series.options.unit + "</b></p><p class='titlespan'>" + point.series.name + "</p>";
//                                });
//                                return str;
//                            }
//                        },
//                        legend: {
//                            enabled: true,
//                            floating: false,
//                            align: 'center',
//                            layout: 'horizontal',
//                            verticalAlign: 'bottom',
//                            symbolRadius: 5,
//                            symbolWidth: 12
//                                //x: 90,
//                                /*y: 15*/
//                        },
//                        exporting: {
//                            csv: {
//                                dateFormat: "%c"
//                            }
//                        },
//                        series: [
//                            {
//                                id: 'activePower',
//                                type: 'area',
//                                name: 'Active Power',
//                                data: [],
//                                yAxis: 1,
//                                color: '#b24350',
//                                lineColor: '#b24350',
//                                unit: "kW"
//                            }
//                        ]
//                    };
                    var PoavsApChart = new BaseChart({
                        el:$('.js-poa-vs-ap').get(0),
                        xAxis:{
                            type:'datetime'
                        },
                        yAxis:[{
                            name:"Irradiance    (W/m2)",
                            opts:{
                                opposite:true
                            }
                        },{
                            name:"Active Power    (kW)"
                        }],
                        tooltipFormatter:function(){
                            var str = "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + "</b></p>";
                                angular.forEach(this.points, function (point) {
                                    str += "<p class='valuespan'><b>" + point.y.toFixed(1) + " " + point.series.options.unit + "</b></p><p class='titlespan'>" + point.series.name + "</p>";
                                });
                                return str;
                        },
                        xAxisFormatter:function(){
                            return moment(this.value).format(ToolTipDateFormatter[viewmode]);
                        },
                        series:[]
                    });






                    scope.showRefresh = function () {
//                        poaVsApGraph.showLoading();
                    };

                    scope.noDataFound = function () {
                        //                    poaVsApGraph
                    };

                    $timeout(function () {
                        PoavsApChart.renderChart();

                        scope.$watch('poaVsApData', function (data) {

                            var series=[];
                            if(!$.isEmptyObject(data)){
                                viewmode = scope.viewMode;

                                series.push({
                                    id: 'activePower',
                                    type: 'area',
                                    name: 'Active Power',
                                    data: data['activepower'],
                                    yAxis: 1,
                                    color: '#b24350',
                                    lineColor: '#b24350',
                                    unit: "kW"
                                });

                                angular.forEach(data['poa'], function (p, index) {
                                    series.push({
                                        name: "POA" + (index + 1) + "",
                                        data: p['dataPoints'],
                                        yAxis: 0,
                                        type: 'area',
                                        unit: "w/m2"
                                    });
                                });

                                PoavsApChart.addSeries(series);
                            }
                        });


//                        $('.js-poa-vs-ap').highcharts(ChartOpts);
//                        poaVsApGraph = $('.js-poa-vs-ap').highcharts();
//
//                        /* Zoom reset Code */
//                        function resetChartZoom() {
//                            poaVsApGraph.zoomOut();
//                        }
//                        $('#resetZoomPOA').click(function () {
//                            resetChartZoom();
//                        });
//                        /* Zoom reset Code Ends*/
//
//                        poaVsApGraph.showLoading();
//                        scope.$watch('poaVsApData', function (data) {
//
//                            if (!$.isEmptyObject(data) && data['activepower'].length > 0 && data['poa'].length > 0) {
//                                viewmode = scope.viewMode;
//                                poaVsApGraph.series[0].update({
//                                    type: 'area'
//                                });
//                                while (poaVsApGraph.series.length > 1) {
//                                    poaVsApGraph.series[1].remove(true);
//                                }
//                                poaVsApGraph.series[0].setData(data['activepower']);
//
//                                if (!poaVsApGraph.series[0].visible) {
//                                    poaVsApGraph.series[0].show();
//                                }
//                                angular.forEach(data['poa'], function (p, index) {
//                                    poaVsApGraph.addSeries({
//                                        name: "POA" + (index + 1) + "",
//                                        data: p['dataPoints'],
//                                        yAxis: 0,
//                                        type: 'area',
//                                        unit: "w/m2"
//                                    })
//                                });
//
//                                $('#js-hideshow-poavsamb').click(function () {
//                                    $('#js-hideshow-poavsamb').toggleClass('theme-showeye').toggleClass('theme-hideeye');
//                                    if (scope.hideShowVal === "HideAll") {
//                                        scope.hideShowVal = "ShowAll";
//                                        for (var i = 0; i < poaVsApGraph.series.length; i++) {
//                                            poaVsApGraph.series[i].hide();
//                                        }
//                                    } else {
//                                        scope.hideShowVal = "HideAll";
//                                        for (var i = 0; i < poaVsApGraph.series.length; i++) {
//                                            poaVsApGraph.series[i].show();
//                                        }
//                                    }
//                                });
//                                poaVsApGraph.hideLoading();
//                            } else if (data['activepower'] && data['poa'] && data['activepower'].length === 0 && data['poa'].length === 0) {
//                                while (poaVsApGraph.series.length > 1) {
//                                    poaVsApGraph.series[1].remove(true);
//                                }
//                                if (poaVsApGraph.series.length > 0) {
//                                    poaVsApGraph.series[0].hide();
//                                }
//                            } else {
//                                if (poaVsApGraph.series.length > 0) {
//                                    poaVsApGraph.series[0].hide();
//                                }
//                            }
//                            if (!$.isEmptyObject(data)) {
//                                if (data.activepower.length == 1) {
//                                    for (var i = 0; i < poaVsApGraph.series.length; i++) {
//                                        poaVsApGraph.series[i].update({
//                                            type: 'bar'
//                                        });
//                                    }
//
//                                }
//
//                            }
//                        });
//
//                        $(elem).find('.panel-refresh').on('click', function () {
//                            poaVsApGraph.showLoading();
//                            scope.getData();
//                        });
                    });
                }
            }
    }]);

    singleSiteDirectives.directive('zonesPrCompare', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-single-site-zone-pr"></div>',
                link: function (scope, elem, attrs) {
                    var PostChartOpts = {};
                    var ChartOpts = {
                        chart: {
                            type: 'bar'
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: 'Performance Ratio (R<sub>p</sub>)'
                        },
                        xAxis: {
                            categories: [],
                            lineWidth: 1,
                            gridLineWidth: 0,
                            labels: {
                                enabled: true
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Performance(%)'
                            },
                            lineWidth: 1,
                            gridLineWidth: 0,
                            labels: {
                                enabled: true
                            },
                            min: 0,
                            max: 100
                        },
                        legend: {
                            enabled: false,
                            floating: true,
                            align: 'left',
                            layout: 'horizontal',
                            verticalAlign: 'top',
                            symbolRadius: 5,
                            symbolWidth: 12,
                            y: -10
                        },
                        exporting: {
                            csv: {
                                dateFormat: "%c"
                            }
                        },
                        tooltip: {
                            followPointer: true,
                            backgroundColor: null,
                            useHTML: true,
                            borderWidth: 0,
                            style: {
                                padding: 0
                            },
                            formatter: function () {
                                return '<span class="titlespancol">' + this.x + '</span>' +
                                    '<span class="valuespancol"><b>' + this.y.toFixed(2) + ' %</b></span>';
                            }
                        },
                        series: [
                            {
                                color: '#F7A35C',
                                data: [],
                                dataLabels: {
                                    //y: -3,
                                    align: 'left',
                                    inside: true,
                                    formatter: function () {
                                        return '<b>' + this.y.toFixed(2) + ' %</b>';
                                    },
                                    enabled: true
                                },
                                //                                pointWidth: 30,
                                name: 'Performance'
                        }
                    ]
                    };


                    $timeout(function () {
                        $('.js-single-site-zone-pr').highcharts(ChartOpts);
                        PostChartOpts = $('.js-single-site-zone-pr').highcharts();
                        PostChartOpts.showLoading();
                        scope.$watch('zonePrData', function (data) {
                            var categories = _.pluck(data, 'subject');
                            var yieldValues = _.pluck(data, 'value');
                            var valueColor = []

                            /* if value exceed 100% color red to the bar
                            @author : Pratik*/

                            if (!$.isEmptyObject(data)) {
                                for (var i = 0; i < data.length; i++) {
                                    valueColor.push({
                                        y: data[i].value,
                                        color: data[i].value > 100 ? '#FF0000' : '#F7A35C'
                                    })
                                }
                            }

                            PostChartOpts.xAxis[0].setCategories(categories);
                            PostChartOpts.series[0].setData(valueColor);
                            PostChartOpts.reflow();

                            $timeout(function () {
                                $(document).resize();
                            }, 100);

                            PostChartOpts.hideLoading();
                        });

                    });
                }
            }
    }]);

    singleSiteDirectives.directive('singleSiteSpPower', ['$timeout', 'ToolTipDateFormatter',
        function ($timeout, ToolTipDateFormatter) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-sp-power-zone"></div>',
                link: function (scope, elem, attrs) {
                    var PostChartopts = {};
                    var viewmode = scope.viewMode;
                    var ChartOpts = {
                        chart: {
                            marginRight: 90,
                            zoomType: 'xy',
                            type: 'line',
                            height: 230
                        },
                        title: {
                            text: 'Specific Power (kW/kWp)'
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            type: 'datetime',
                            labels: {
                                overflow: 'justify',
                                formatter: function () {
                                    return moment(this.value).format(ToolTipDateFormatter[viewmode]);

                                },
                                style: {
                                    'font-size': '12px',
                                    'color': "#000000"
                                }
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Specific Power'
                            },
                            labels: {
                                style: {
                                    'font-size': '8pt',
                                    'color': "#000000"
                                }
                            },
                            min: 0
                        },
                        exporting: {
                            csv: {
                                dateFormat: "%c"
                            }
                        },
                        tooltip: {
                            shared: true,
                            backgroundColor: null,
                            useHTML: true,
                            borderWidth: 0,
                            style: {
                                padding: 0
                            },
                            formatter: function (opt) {
                                var str = "";
                                str = "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + "</b></p>";
                                angular.forEach(this.points, function (point) {
                                    str += "<b><p class='valuespan'>" + point.y.toFixed(1) + " kW/kWp</b></p><p class='titlespan'>" + point.series.name + "</p>"
                                });
                                return str;

                            }
                        },
                        plotOptions: {
                            line: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        legend: {
                            floating: true,
                            align: 'right',
                            layout: 'vertical',
                            verticalAlign: 'top',
                            symbolRadius: 5,
                            symbolWidth: 12,
                            x: 10,
                            y: -16
                        },
                        series: []
                    };

                    scope.showRefresh = function () {
                        PostChartopts.showLoading();
                    };


                    $timeout(function () {

                        $('.js-sp-power-zone').highcharts(ChartOpts);
                        PostChartopts = $('.js-sp-power-zone').highcharts();
                        /* Zoom reset Code */
                        function resetChartZoom() {
                            PostChartopts.zoomOut();
                        }
                        $('#resetZoomSPP').click(function () {
                            resetChartZoom();
                        });
                        /* Zoom reset Code Ends*/
                        PostChartopts.showLoading();
                        scope.$watch('specificPowerInfo', function (data) {
                            if (!$.isEmptyObject(data)) {
                                viewmode = scope.viewMode;

                                if (PostChartopts.series.length > 0) {
                                    while (PostChartopts.series.length > 0) {
                                        PostChartopts.series[0].remove(true);
                                    }
                                }
                                angular.forEach(data, function (datum) {
                                    PostChartopts.addSeries({
                                        name: datum['zoneName'],
                                        data: datum['ap'],
                                        tooltip: {
                                            shared: true
                                        }
                                    });
                                    if (datum['ap'].length == 1) {
                                        for (var i = 0; i < PostChartopts.series.length; i++) {
                                            PostChartopts.series[i].update({
                                                type: 'bar'
                                            });
                                        }

                                    }
                                });
                                $('#js-hideshow-specificpower').click(function () {
                                    $('#js-hideshow-specificpower').toggleClass('theme-showeye').toggleClass('theme-hideeye');
                                    if (scope.hideShowVal === "HideAll") {
                                        scope.hideShowVal = "ShowAll";
                                        for (var i = 0; i < PostChartopts.series.length; i++) {
                                            PostChartopts.series[i].hide();
                                        }
                                    } else {
                                        scope.hideShowVal = "HideAll";
                                        for (var i = 0; i < PostChartopts.series.length; i++) {
                                            PostChartopts.series[i].show();
                                        }
                                    }
                                });
                                PostChartopts.hideLoading();
                                PostChartopts.reflow();
                            } else {
                                if (PostChartopts.series.length > 0) {
                                    while (PostChartopts.series.length > 0) {
                                        PostChartopts.series[0].remove(true);
                                    }
                                }
                            }
                        });
                    });
                }
            }
    }]);
    singleSiteDirectives.directive('singleSitePeakPower', ['$timeout', 'ToolTipDateFormatter',
        function ($timeout, ToolTipDateFormatter) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-site-peakpower"></div>',
                link: function (scope, elem, attrs) {
                    var PostChartOpts = {};
                    var ChartOpts = {
                        chart: {
                            type: 'bar'
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: 'Peak Power (kW)'
                        },
                        xAxis: {
                            categories: [],
                            lineWidth: 1,
                            gridLineWidth: 0,
                            labels: {
                                enabled: true
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Peak Power(kW)'
                            },
                            lineWidth: 1,
                            gridLineWidth: 0,
                            labels: {
                                enabled: true
                            },
                            min: 0
                        },
                        exporting: {
                            csv: {
                                dateFormat: "%c"
                            }
                        },
                        legend: {
                            enabled: false,
                            floating: true,
                            align: 'left',
                            layout: 'horizontal',
                            verticalAlign: 'top',
                            symbolRadius: 5,
                            symbolWidth: 12,
                            y: -10
                        },
                        tooltip: {
                            followPointer: true,
                            backgroundColor: null,
                            useHTML: true,
                            borderWidth: 0,
                            style: {
                                padding: 0
                            },
                            formatter: function () {
                                return '<span class="titlespancol">' + this.x + '</span>' +
                                    '<span class="valuespancol"><b>' + this.y.toFixed(2) + ' kW</b></span>';
                            }
                        },
                        series: [
                            {
                                color: '#F7A35C',
                                data: [],
                                dataLabels: {
                                    overflow: 'none',
                                    //y: -3,
                                    align: 'left',
                                    inside: true,
                                    formatter: function () {
                                        return '<b>' + this.y.toFixed(2) + ' kW</b>';
                                    },
                                    enabled: true
                                },
                                //                                pointWidth: 30,
                                name: 'Performance'
                            }
                        ]
                    };
                    scope.showRefresh = function () {
                        PostChartOpts.showLoading();
                    };
                    $timeout(function () {
                        $('.js-site-peakpower').highcharts(ChartOpts);
                        PostChartOpts = $('.js-site-peakpower').highcharts();
                        PostChartOpts.showLoading();
                        scope.$watch('peakPowerInfo', function (data) {
                            PostChartOpts.xAxis[0].setCategories(data.zonenames);
                            PostChartOpts.series[0].setData(data.peakpower);
                            PostChartOpts.reflow();
                            PostChartOpts.hideLoading();
                        })
                    });
                }
            }
        }]);
    singleSiteDirectives.directive('singleSiteSpYield', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-single-site-sp-yield" style=""></div>',
                link: function (scope, elem, attrs) {
                    var PostChartOpts = {};
                    var ChartOpts = {
                        chart: {
                            type: 'bar',
                            height: 220
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            categories: [],
                            lineWidth: 1,
                            gridLineWidth: 0,
                            labels: {
                                enabled: true
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Specific Yield'
                            },
                            lineWidth: 1,
                            gridLineWidth: 0,
                            labels: {
                                enabled: true
                            },
                            min: 0
                        },
                        exporting: {
                            csv: {
                                dateFormat: "%c"
                            }
                        },
                        legend: {
                            enabled: false,
                            floating: true,
                            align: 'left',
                            layout: 'horizontal',
                            verticalAlign: 'top',
                            symbolRadius: 5,
                            symbolWidth: 12,
                            y: -10
                        },
                        series: [
                            {
                                data: [],
                                dataLabels: {
                                    formatter: function () {
                                        return '<b>' + this.y.toFixed(2) + ' </b>';
                                    },
                                    enabled: true
                                },
                                //                                pointWidth: 20,
                                name: 'Specific Yield',
                                color: '#326db0'
                        }
                    ]
                    };


                    $timeout(function () {
                        $('.js-single-site-sp-yield').highcharts(ChartOpts);
                        PostChartOpts = $('.js-single-site-sp-yield').highcharts();
                        PostChartOpts.showLoading();
                        scope.$watch('singleSiteSpYield', function (data) {
                            var categories = _.pluck(data, 'subject');
                            var yieldValues = _.pluck(data, 'value');

                            PostChartOpts.xAxis[0].setCategories(categories);
                            PostChartOpts.series[0].setData(yieldValues);
                            PostChartOpts.reflow();
                            PostChartOpts.hideLoading();
                        });

                    });
                }
            }
    }]);

    singleSiteDirectives.directive("progressValue", ['$timeout', function ($timeout) {
        return {
            restrict: "AC",
            scope: {
                value: "="
            },
            template: "",
            link: function (scope, elem, attrs) {

                var val = scope.value * 100 / 10;
                $(elem).css('width', val + "%");

                $(elem).removeClass("progress-bar-success").removeClass("progress-bar-warning").removeClass("progress-bar-error");

                if (val <= 5) {
                    $(elem).addClass("progress-bar-danger");
                } else if (val <= 25) {
                    $(elem).addClass("progress-bar-warning");
                } else {
                    $(elem).addClass("progress-bar-success");
                }
            }
        }
    }]);

    singleSiteDirectives.directive('singleSiteEnergyYield', ['$timeout', 'ToolTipDateFormatter',
        function ($timeout, ToolTipDateFormatter) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-energy-trend"></div>',
                link: function (scope, elem, attrs) {
                    var energyTrendsGraph = {};
                    var panel = {};
                    var viewmode = scope.viewMode;
                    var ChartOpts = {
                        chart: {
                            zoomType: 'xy',
                            type: 'area'
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: 'Plant Energy (kWh)'
                        },
                        xAxis: {

                            type: 'datetime',
                            lineWidth: 1,
                            gridLineWidth: 1,
                            gridLineDashStyle: 'ShortDash',
                            labels: {
                                formatter: function () {
                                    return moment(this.value).format(ToolTipDateFormatter[viewmode]);
                                },
                                style: {
                                    'font-size': '8pt',
                                    'color': "#000000"
                                }
                            }
                        },
                        yAxis: {
                            title: {
                                text: null
                            },
                            labels: {
                                style: {
                                    'font-size': '8pt',
                                    'color': "#000000"
                                }
                            },
                            gridLineWidth: 1,
                            gridLineDashStyle: 'ShortDash',
                            gridLineColor: '#CCCCCC',
                            min: 0,
                            lineWidth: 1
                        },
                        exporting: {
                            csv: {
                                dateFormat: "%c"
                            }
                        },
                        tooltip: {
                            backgroundColor: null,
                            useHTML: true,
                            borderWidth: 0,
                            style: {
                                padding: 0
                            },
                            formatter: function () {
                                return "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + "</b></p><p class='valuespan'><b>" + this.y.toFixed(1) + " kWh</b></p><p class='titlespan'>Plant Energy</p>";
                            }
                        },
                        legend: {
                            floating: false,
                            align: 'center',
                            layout: 'horizontal',
                            verticalAlign: 'bottom',
                            symbolRadius: 5,
                            symbolWidth: 12
                                /*x: 90,
                                y: -16*/
                        },
                        plotOptions: {
                            series: {
                                cropThreshold: 40
                            }
                        },
                        series: [
                            {
                                data: [],
                                pointWidth: 8,
                                name: scope.siteName,
                                color: '#a4ca4b'
                        }
                    ]
                    };

                    scope.showRefresh = function () {
                        energyTrendsGraph.showLoading();
                    };

                    $timeout(function () {
                        panel = $(elem);
                        $('.js-energy-trend').highcharts(ChartOpts);
                        energyTrendsGraph = $('.js-energy-trend').highcharts();

                        /* Zoom reset Code */
                        function resetChartZoom() {
                            energyTrendsGraph.zoomOut();
                        }
                        $('#resetZoomPY').click(function () {
                            resetChartZoom();
                        });
                        /* Zoom reset Code Ends*/

                        energyTrendsGraph.showLoading();

                        scope.$watch('energyTrendsData', function (data) {

                            if (!$.isEmptyObject(data) && data['data'].length > 0) {
                                viewmode = scope.viewMode;

                                energyTrendsGraph.xAxis[0].setCategories(data['ts']);
                                if (energyTrendsGraph.series[0].data.length >= 1) {
                                    while (energyTrendsGraph.series.length > 0) {
                                        energyTrendsGraph.series[0].remove(true);
                                    }
                                    energyTrendsGraph.addSeries({
                                        name: scope.siteName,
                                        color: '#a4ca4b',
                                        data: data['data']

                                    });

                                    if (data.data.length == 1) {
                                        energyTrendsGraph.series[0].update({
                                            type: 'bar'
                                        });
                                    }

                                } else {
                                    energyTrendsGraph.series[0].setData(data['data']);
                                }

                                $('#js-hideshow-energytrends').click(function () {
                                    $('#js-hideshow-energytrends').toggleClass('theme-showeye').toggleClass('theme-hideeye');
                                    if (scope.hideShowVal === "HideAll") {
                                        scope.hideShowVal = "ShowAll";
                                        for (var i = 0; i < energyTrendsGraph.series.length; i++) {
                                            energyTrendsGraph.series[i].hide();
                                        }
                                    } else {
                                        scope.hideShowVal = "HideAll";
                                        for (var i = 0; i < energyTrendsGraph.series.length; i++) {
                                            energyTrendsGraph.series[i].show();
                                        }
                                    }
                                });
                                energyTrendsGraph.reflow();
                                energyTrendsGraph.hideLoading();
                            }

                        });

                        panel.find('.panel-refresh').on('click', function () {
                            energyTrendsGraph.showLoading();
                            scope.getData();
                        });
                    });
                }
            }
        }]);

    singleSiteDirectives.directive('singleSitePrTrend', ['$timeout', 'AjaxLoader', 'ToolTipDateFormatter',
        function ($timeout, AjaxLoader, ToolTipDateFormatter) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-pr-trend"></div>',
                link: function (scope, elem, attrs) {
                    var prGraph = {};
                    var viewmode = "days";
                    var ChartOpts = {
                        chart: {
                            type: 'column'
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: 'Performance Ratio Trend (%)'
                        },
                        xAxis: {
                            categories: [],
                            labels: {
                                formatter: function () {
                                    return moment(this.value).format(ToolTipDateFormatter[scope.viewMode]);
                                },
                                style: {
                                    'font-size': '8pt !important',
                                    'color': "#000000 !important"
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: null
                            },
                            lineWidth: 1,
                            labels: {
                                style: {
                                    'font-size': '8pt',
                                    'color': "#000000"
                                }
                            }
                        },
                        legend: {
                            floating: false,
                            align: 'center',
                            layout: 'horizontal',
                            verticalAlign: 'bottom',
                            symbolRadius: 5,
                            symbolWidth: 12
                                /*x: 90,
                                y: -16*/
                        },
                        tooltip: {
                            backgroundColor: null,
                            useHTML: true,
                            borderWidth: 0,
                            style: {
                                padding: 0
                            },
                            formatter: function () {
                                return "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[scope.viewMode]) + "</b>" + "</p><p class='valuespan'><b>" + this.y.toFixed(1) + "%</b></p><p class='titlespan'>" + this.series.name + "</p>";
                            }
                        },
                        series: [
                            {
                                data: [],
                                dataLabels: {
                                    formatter: function () {
                                        return '<b>' + this.y.toFixed(2) + ' %</b>';
                                    },
                                    enabled: true
                                },
                                name: "PR",
                                color: '#f0b21c'
                            }
                        ],
                        exporting: {
                            csv: {
                                dateFormat: "%c"
                            }
                        }
                    };

                    scope.showRefresh = function () {
                        prGraph.showLoading();
                    };

                    $timeout(function () {

                        $('.js-pr-trend').highcharts(ChartOpts);
                        prGraph = $('.js-pr-trend').highcharts();
                        prGraph.showLoading();

                        scope.$watch('prTrendsData', function (data) {
                            if (!$.isEmptyObject(data)) {
                                var categories = data['categories'];
                                var values = data['data'];

                                prGraph.xAxis[0].setCategories(categories);
                                prGraph.series[0].setData(values);
                                prGraph.reflow();
                                prGraph.hideLoading();
                            }
                        });

                    });
                }
            }
    }]);

    singleSiteDirectives.directive('zonesOverview', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                templateUrl: '/modules/dashboard/html/partials/single-site/zones-overview.html',
                link: function (scope, elem, attrs) {
                    scope.options = {};
                    var oTable = {};
                    var TableApi = {};
                    var opts = {
                        "ordering": false,
                        "info": false,
                        "lengthChange": false,
                        "searching": false,
                        "paging": false,
                        responsive: true
                    };
                    var columnDefs = [
                        {
                            targets: [0],
                            sWidth: '20%',
                            mData: 'zoneName'
                        },
                        {
                            targets: [1],
                            sWidth: '16%',
                            mData: 'installedCapacity',
                            render: function (a, b, c) {
                                if (c.zoneName !== "-") {
                                    return "<span >" + a + "</span>";
                                } else {
                                    return "<span style='font-size: 14px;font-weight: 600'> Total &nbsp;&nbsp;: &nbsp;&nbsp;" + a + "</span>";
                                }
                            }
                        },
                        {
                            targets: [2],
                            sWidth: '18%',
                            mData: 'activePower',
                            render: formatTodayGeneration
                        },
                        {
                            targets: [3],
                            sWidth: '18%',
                            mData: 'todayYield',
                            render: formatTodayYield
                        },
                        {
                            targets: [4],
                            sWidth: '18%',
                            mData: 'totalYield',
                            render: formatTodayYield
                        },
                        {
                            targets: [5],
                            sWidth: '10%',
                            mData: 'poaEnergy',
                            render: formatPoaEnergy
                        },
                        {
                            targets: [6],
                            sWidth: '10%',
                            mData: 'cuf',
                            render: formatCuf
                        }
                    ];

                    scope.options = {
                        "columnDefs": columnDefs,
                        "fnDrawCallback": putSliderIn
                    };

                    function putSliderIn() {
                        $(".js-today-gen-slider").ionRangeSlider();

                        var fromSlider = $(elem).find(".js-today-gen-slider");

                        fromSlider.each(function (e, el) {
                            var from = $(el).data("from");
                            if (!from) {
                                $(el).prev().find('.irs-bar-edge').css('width', '0px');
                            }
                        });
                    }

                    function formatTodayGeneration(a, b, c) {

                        var t = (c.activePower === 0) ? 0 : c.activePower.toFixed(2);

                        if (c.zoneName !== "-") {
                            var ionslider = '<input class="js-today-gen-slider" type="hidden" data-from-fixed="true"  data-hide-min-max="true" data-hide-from-to="true" ' +
                                'data-type="single" data-min="0" data-step="30" data-from="' + t +
                                '" data-max="' + c.installedCapacity + '">';
                            return "<span class='col-md-4'>" + t + "</span>" + "<span class='col-md-8 theme-today-gen'>" + ionslider + "</span>";
                        } else {
                            return "<span style='font-size: 14px;font-weight: 600'> Total &nbsp;&nbsp;: &nbsp;&nbsp;" + t + "</span>";
                        }

                    }

                    function formatPoaEnergy(a, b, c) {
                        if (!a) {
                            return "-";
                        }
                        if (c.zoneName !== "-") {
                            return "<span >" + a.toFixed(2) + "</span>";
                        } else {
                            return "<span style='font-size: 14px;font-weight: 600'> Average  &nbsp;&nbsp; : &nbsp;&nbsp;  " + a.toFixed(2) + "</span>";
                        }

                    }


                    function formatTodayYield(a, b, c) {
                        if (c.zoneName !== "-") {
                            return "<span class=''>" + a.toFixed(2) + "</span>";
                        } else {
                            return "<span style='font-size: 14px;font-weight: 600'> Total &nbsp;&nbsp;: &nbsp;&nbsp;" + a.toFixed(2) + "</span>";
                        }

                    }

                    function formatCuf(a, b, c) {
                        if (c.zoneName !== "-") {
                            return '<span>' + a.toFixed(2) + '</span>';
                        } else {
                            return "<span style='font-size: 14px;font-weight: 600'> Average &nbsp;&nbsp; : &nbsp;&nbsp; " + a.toFixed(2) + "</span>";
                        }

                    }

                    scope.updateData = function (data) {
                        if (data && data.length > 0) {
                            if (TableApi.rows().length >= 1) {
                                TableApi.clear().draw();
                            }
                            oTable.fnAddData(data);
                        }
                    };


                    $timeout(function () {
                        opts = _.extend({}, opts, scope.options);
                        oTable = $('#js-zones-overview').dataTable(opts);
                        TableApi = oTable.DataTable();

                        $(elem).find('.panel-refresh').on('click', function () {
                            scope.getData();
                        });
                    });

                    //                    function handleFixedHeader(ev){
                    //
                    //                        $('.js-to-hide-header').hide();
                    //                        $('.js-to-show-header').show();
                    //
                    //                        if(angular.element(elem)[0].scrollTop <= 20){
                    //                            $('.js-to-hide-header').show();
                    //                            $('.js-to-show-header').hide();
                    //                        }
                    //                    }
                    //
                    //                    var debouncedFn = _.throttle(handleFixedHeader,100,{leading: false});
                    //
                    //                    angular.element(elem).bind('scroll',debouncedFn);
                }
            }
    }]);

    singleSiteDirectives.directive('singleSiteCuf', ['$timeout', 'ToolTipDateFormatter', function ($timeout, ToolTipDateFormatter) {
        return {
            restrict: "EA",
            scope: false,
            template: '<div class="col-md-12 js-cuf-trend"></div>',
            link: function (scope, elem, attrs) {
                var PostChartOpts = {};
                var ChartOpts = {
                    chart: {
                        type: 'column'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Single Site CUF(%)'
                    },
                    xAxis: {
                        type: 'datetime',
                        lineWidth: 1,
                        gridLineWidth: 0,
                        labels: {
                            enabled: true,
                            formatter: function () {
                                return moment(this.value).format(ToolTipDateFormatter[scope.viewMode]);
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'CUF(%)'
                        },
                        lineWidth: 1,
                        labels: {
                            enabled: true
                        },
                        min: 0
                    },
                    legend: {
                        floating: false,
                        align: 'center',
                        layout: 'horizontal',
                        verticalAlign: 'bottom',
                        symbolRadius: 5,
                        symbolWidth: 12
                            /*x: 90,
                            y: -16*/
                    },
                    tooltip: {
                        backgroundColor: null,
                        useHTML: true,
                        borderWidth: 0,
                        style: {
                            padding: 0
                        },
                        formatter: function () {
                            return '<p class="timevaluespan"><i class="fa fa-clock-o" style="font-size:14px;"></i><b> ' + moment(this.x).format(ToolTipDateFormatter[scope.viewMode]) + '</b></p><p class="valuespan"><b>' + this.y.toFixed(1) + ' %</b></p><p class="titlespan">' + this.series.name + '</p>';
                        }
                    },
                    exporting: {
                        csv: {
                            dateFormat: "%c"
                        }
                    },
                    series: [
                        {
                            data: [],
                            dataLabels: {
                                formatter: function () {
                                    return '<b>' + this.y.toFixed(2) + ' %</b>';
                                },
                                enabled: true
                            },
                            name: 'CUF',
                            color: '#1F9F1A'
                        }
                    ]
                };

                scope.showRefresh = function () {
                    PostChartOpts.showLoading();
                };


                $timeout(function () {

                    $('.js-cuf-trend').highcharts(ChartOpts);
                    PostChartOpts = $('.js-cuf-trend').highcharts();
                    PostChartOpts.showLoading();

                    scope.$watch('cufTrendsData', function (trends) {
                        if (!$.isEmptyObject(trends)) {
                            //                            PostChartOpts.xAxis[0].setData(trends['ts']);
                            PostChartOpts.series[0].setData(trends['data']);
                            PostChartOpts.reflow();
                            PostChartOpts.hideLoading();
                        }
                    });

                });

            }
        }
    }]);

    return singleSiteDirectives;
});