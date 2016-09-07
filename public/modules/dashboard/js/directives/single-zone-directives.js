/**
 * Created by Sneha on 7/1/15.
 */

define(['angular', 'highcharts-more', 'highcharts-solidgauge', 'angularCarousel'], function (angular) {

    var Directives = angular.module('SolarPulse.SingleZone.Directives', ['angular-carousel']);

    Directives.directive('topWidgets3', ['$timeout', function ($timeout) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: "/modules/dashboard/html/partials/single-zone/top-widgets.html",
            link: function (scope, elem, attrs) {
                scope.i = 0, scope.j = 0;
                scope.slides = [0, 1];
                $timeout(function () {
                    $('.js-username').html(scope.User.user.username);
                });
            }
        };
    }]);

    Directives.directive('singleZoneMap', ['$timeout', function ($timeout) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: '/modules/dashboard/html/partials/single-zone/single-zone-map.html',
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    var setZoneMap;
                    var mapOptions = {
                        center: new google.maps.LatLng('17.445882', '78.632691'),
                        zoom: 18,
                        streetViewControl: true,
                        mapTypeId: 'satellite'
                    };
                    scope.$watch("ZoneDetails", function (data) {
                        if (!$.isEmptyObject(data)) {
                            var singleZoneMap = {};
                            var marker;

                            var zone = data[0].location.features[0].geometry.coordinates[0];

                            var zoneCoords = [];
                            for (var i = 0; i < zone.length; i++) {
                                zoneCoords.push(new google.maps.LatLng(zone[i][1], zone[i][0]));
                                mapOptions.center = new google.maps.LatLng(zone[i][1], zone[i][0]);
                            }

                            // Construct the polygon.
                            setZoneMap = new google.maps.Polygon({
                                paths: zoneCoords,
                                strokeColor: '#03570A',
                                strokeOpacity: 0.7,
                                strokeWeight: 3,
                                fillColor: '#03570A',
                                fillOpacity: 0.3
                            });

                            singleZoneMap = new google.maps.Map($(elem).find('.js-single-zone-map')[0], mapOptions);
                            setZoneMap.setMap(singleZoneMap);
                        }
                    });
                    $('.js-panel-map').on('click', function () {
                        $timeout(function () {
                            $('.js-map-panel-body').css('height', '248px');
                            google.maps.event.trigger(setZoneMap, 'resize');
                        });
                    });
                });

                $timeout(function () {
                    $(document).resize();
                }, 300);
            }
        };
    }]);

    Directives.directive('singleZoneAlarms', ['$timeout', 'AjaxLoader', function ($timeout, AjaxLoader) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: '/modules/dashboard/html/partials/single-zone/single-zone-alarms.html',
            link: function (scope, elem, attrs) {}
        }
    }]);


    Directives.directive('singleZonePrCompare', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-single-zone-pr"></div>',
                link: function (scope, elem, attrs) {
                    var PostChartOpts = {};
                    var viewmode = "days";
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
                            backgroundColor: null,
                            useHTML: true,
                            borderWidth: 0,
                            style: {
                                padding: 0
                            },
                            formatter: function () {
                                return "<p class='valuespan'>" + this.y.toFixed(2) + ' %</p><b><p class="titlespan">' + this.x + '</b></p>';
                            }
                        },
                        series: [
                            {
                                data: [],
                                dataLabels: {
                                    align: 'left',
                                    inside: true,
                                    formatter: function () {
                                        return '<b>' + this.y.toFixed(2) + ' %</b>';
                                    },
                                    enabled: true
                                },
                                //                                pointWidth: 30,
                                name: 'Performance',
                                color: '#F7A35C'
                            }
                        ]
                    };
                    scope.showRefresh = function () {
                        PostChartOpts.showLoading();
                    };

                    $timeout(function () {
                        $('.js-single-zone-pr').highcharts(ChartOpts);
                        PostChartOpts = $('.js-single-zone-pr').highcharts();
                        PostChartOpts.showLoading();


                        scope.$watch('zonePrData', function (zonedata) {
                            if (!$.isEmptyObject(zonedata)) {
                                /* if value exceed 100% color red to the bar
                                 @author : Pratik*/
                                /*var valueColor = []
                                if (!$.isEmptyObject(zonedata)) {
                                for (var i = 0; i < zonedata.data.length; i++) {
                                valueColor.push({
                                y: zonedata.data[i].value,
                                color: zonedata.data[i].value > 100 ? '#FF0000' : '#F7A35C'
                                })
                                }
                                }*/
                                PostChartOpts.xAxis[0].setCategories(zonedata.categories);
                                PostChartOpts.series[0].setData(zonedata.data);
                                PostChartOpts.reflow();
                                $timeout(function () {
                                    $(document).resize();
                                }, 100);
                                PostChartOpts.hideLoading();
                            }
                        });

                    });
                }
            }
        }]);


    Directives.directive('singleZoneSpPower', ['$timeout', 'AjaxLoader', 'ToolTipDateFormatter', function ($timeout, AjaxLoader, ToolTipDateFormatter) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: '/modules/dashboard/html/partials/single-zone/single-zone-sp-power.html',
            link: function (scope, elem, attrs) {
                var PostChartopts = {};
                var viewmode = scope.viewMode;
                var ChartOpts = {
                    chart: {
                        type: 'line',
                        zoomType: 'xy',
                        marginRight: 110
                    },
                    title: {
                        text: 'Specific power (kW/kWp)'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        title: {
                            text: 'Time',
                            style: {
                                'color': "#000"
                            }
                        },
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
                            text: 'Specific power (kW/kWp)',
                            style: {
                                'color': "#000"
                            }
                        },
                        labels: {
                            style: {
                                'font-size': '8pt',
                                'color': "#000000"
                            }
                        },
                        plotLines: [
                            {
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }
                        ],
                        min: 0
                    },
                    exporting: {
                        csv: {
                            dateFormat: "%c"
                        }
                    },
                    tooltip: {
                        shared: false,
                        backgroundColor: null,
                        useHTML: true,
                        borderWidth: 2,
                        style: {
                            padding: 0
                        },
                        formatter: function (opt) {
                            return "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + "</b></p><b><p class='valuespan'>" + this.y.toFixed(1) + " kW/kWp</b></p><p class='titlespan'>Specific Power</p>";

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
                        y: -15
                    },
                    series: []
                };
                scope.showRefresh = function () {
                    PostChartopts.showLoading();
                };

                $timeout(function () {
                    var panel = $(elem);
                    $('.js-sp-power-inverter').highcharts(ChartOpts);
                    PostChartopts = $('.js-sp-power-inverter').highcharts();
                    /* Zoom reset Code */
                    function resetChartZoom() {
                        PostChartopts.zoomOut();
                    }
                    $('#resetZoomISP').click(function () {
                        resetChartZoom();
                    });
                    /* Zoom reset Code Ends*/

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
                                    name: datum['deviceName'],
                                    data: datum['ap'],
                                    tooltip: {
                                        shared: false
                                    },
                                    marker: {
                                        symbol: 'circle',
                                        radius: 3
                                    }

                                });
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
                            PostChartopts.series[0].show();
                            PostChartopts.hideLoading();
                            PostChartopts.reflow();
                        } else {
                            if (PostChartopts.series.length > 0) {
                                while (PostChartopts.series.length > 0) {
                                    PostChartopts.series[0].remove(true);
                                }
                                PostChartopts.showLoading("No data Found");
                            }
                        }
                    });
                    panel.find('.panel-refresh').on('click', function () {
                        //energyTrendsGraph.showLoading(panel);
                        PostChartopts.showLoading();
                        scope.getData();
                    });
                });
            }
        }
    }]);

    Directives.directive('singleZoneEnergyYield', ['$timeout', 'AjaxLoader', 'ToolTipDateFormatter', function ($timeout, AjaxLoader, ToolTipDateFormatter) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: '/modules/dashboard/html/partials/single-zone/single-zone-energy-yield.html',
            link: function (scope, elem, attrs) {
                var energyTrendsGraph = {};
                var panel = {};
                var viewmode = scope.viewMode;
                var ChartOpts = {
                    chart: {
                        type: 'column'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Zone Energy (kWh)'
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
                            text: "Energy (kWh)",
                            style: {
                                'color': "#000"
                            }
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
                    tooltip: {
                        backgroundColor: null,
                        useHTML: true,
                        borderWidth: 0,
                        style: {
                            padding: 0
                        },
                        formatter: function () {
                            return "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + "</b></p><p class='valuespan'><b>" + this.y.toFixed(1) + " kWh</b></p><p class='titlespan'>Zone Energy</p>";
                        }
                    },
                    plotOptions: {
                        line: {
                            marker: {
                                radius: 2,
                                symbol: 'circle'
                            }
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
                        x: 90,
                        y: -16
                    },
                    series: [
                        {
                            data: [],
                            name: "Zone Energy",
                            color: '#a4ca4b'
                        }
                    ],
                    exporting: {
                        csv: {
                            dateFormat: "%c"
                        }
                    }
                };

                scope.showRefresh = function () {
                    energyTrendsGraph.showLoading();
                };


                $timeout(function () {
                    var panel = $(elem);
                    $('.js-energy-trend').highcharts(ChartOpts);
                    energyTrendsGraph = $('.js-energy-trend').highcharts();

                    scope.$watch('energyTrendsData', function (data) {
                        if (!$.isEmptyObject(data) && data['data'].length > 0) {
                            viewmode = scope.viewMode;
                            if (energyTrendsGraph.series[0].data.length >= 1) {
                                while (energyTrendsGraph.series.length > 0) {
                                    energyTrendsGraph.series[0].remove(true);
                                }
                                energyTrendsGraph.addSeries({
                                    name: "Zone Energy",
                                    color: '#a4ca4b',
                                    data: data['data']
                                })
                            } else {
                                energyTrendsGraph.series[0].setData(data['data']);
                                //                                alert(energyTrendsGraph.getCSV());
                            }

                            energyTrendsGraph.reflow();
                            energyTrendsGraph.hideLoading();
                            //energyTrendsGraph.removeRefresh($(elem));
                        }
                    });


                    panel.find('.panel-refresh').on('click', function () {
                        //energyTrendsGraph.showLoading(panel);
                        energyTrendsGraph.showLoading();
                        scope.getData();
                    });
                });
            }
        }
    }]);

    return Directives;
});