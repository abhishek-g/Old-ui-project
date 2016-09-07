/**
 * Created by mepc1299 on 11/2/15.
 */
define(['angular', 'moment', 'underscore', 'angularCarousel'], function (angular, moment, _) {
    "use strict";

    var SensorBoxDirectives = angular.module('SolarPulse.SensorBox.Directives', ['angular-carousel']);

    SensorBoxDirectives.directive('templistdirective', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                //replace:true,
                scope: false,
                template: '<button class="btn btn-xs btn-block" ng-click="gettempdate($index)" ng-class="{\'btn-info\':$last}" type="button" ng-repeat="item in datelist">' +
                    '<strong>{{item | date:\'dd-MMM-yyyy\'}}</strong></button>',
                link: function (scope, elem, attrs) {
                    $timeout(function () {
                        scope.$watch('currenttemp', function (newVal) {
                            $('.weather-date-group button').click(function () {
                                $('.weather-date-group button').removeClass('btn-info');
                                $(this).addClass('btn-info');
                            })
                            $(".mCustomScrollbar").mCustomScrollbar({
                                theme: "dark-thin"
                            });
                            //$(this).addClass('btn-info');
                        });
                    });
                }
            }
        }]);

    SensorBoxDirectives.directive('surfaceVsAmbient', ['$timeout', 'ToolTipDateFormatter',
        function ($timeout, ToolTipDateFormatter) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 surface-vs-ambient"></div>',
                link: function (scope, elem, attrs) {
                    var panel = {};
                    var viewmode = scope.viewMode;
                    var surfacevsambientconf = {
                        chart: {
                            renderTo: 'surfacevsambient',
                            type: 'line'
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: "Module vs Ambient Temperature"
                        },
                        exporting: {
                            csv: {
                                dateFormat: "%c"
                            }
                        },
                        xAxis: {
                            type: 'datetime',
                            labels: {
                                formatter: function () {
                                    //                                    console.log(ToolTipDateFormatter[viewmode]);
                                    return moment(this.value).format(ToolTipDateFormatter[viewmode]);
                                }
                            },
                            startOnTick: true,
                            endOnTick: true,
                            showLastLabel: true
                        },
                        yAxis: {
                            title: {
                                text: "Temperature(℃)",
                                style: {
                                    'color': "#000"
                                }
                            },
                            labels: {
                                style: {
                                    "color": "#5472ce",
                                    "font-family": "Roboto-Medium",
                                    "font-size": "10pt"
                                }
                            },
                            min: 0
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
                                var str = "";
                                str = "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + " </b> </p>";
                                angular.forEach(this.points, function (point) {
                                    str += "<p class='valuespan'><b>" + point.y.toFixed(2) + " ℃<b></p><p class='titlespan'>" + point.series.name + "</p>";
                                });
                                return str;
                            }
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: true,
                                    radius: 1
                                }
                            },
                            column: {
                                grouping: false,
                                shadow: false,
                                borderWidth: 0
                            }
                        },
                        series: [
                            {
                                name: 'Mod Temp',
                                color: '#7D7395',
                                data: []

                            }, {
                                name: "Amb Temp",
                                color: 'green',
                                data: []
                            }
                        ]
                    };
                    scope.showRefresh = function () {
                        surfacevsambientchart.showLoading();
                    };
                    var surfacevsambientchart = new Highcharts.Chart(surfacevsambientconf);
                    panel = $(elem);
                    surfacevsambientchart.showLoading();
                    scope.$watch('stvsambt', function (data) {
                        if (data.length > 0) {
                            angular.forEach(data, function (datum, index) {
                                console.log('surfavsamb' + angular.toJson(datum.seriesData));
                                surfacevsambientchart.series[index].setData(datum.seriesData);
                            });
                            surfacevsambientchart.hideLoading();
                        }
                    });
                    panel.find('.panel-refresh').on('click', function () {
                        surfacevsambientchart.showLoading();
                        scope.getData();
                    });
                }
            }
        }]);
    SensorBoxDirectives.directive('windDirection', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                link: function (scope, elem, attrs) {
                    var winddirectionconf = {

                        chart: {
                            renderTo: 'winddirection',
                            type: 'gauge',

                            plotBackgroundImage: null,
                            plotBorderWidth: 0,
                            plotShadow: false

                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: 'Compass'
                        },

                        pane: {
                            startAngle: 0,
                            endAngle: 360
                        },

                        // the value axis
                        yAxis: {
                            min: 0,
                            max: 360,

                            tickInterval: 45,
                            labels: {
                                rotation: 'auto',
                                formatter: function () {
                                    if (this.value == 360) {
                                        return 'N';
                                    } else if (this.value == 45) {
                                        return 'NE';
                                    } else if (this.value == 90) {
                                        return 'E';
                                    } else if (this.value == 135) {
                                        return 'SE';
                                    } else if (this.value == 180) {
                                        return 'S';
                                    } else if (this.value == 225) {
                                        return 'SW';
                                    } else if (this.value == 270) {
                                        return 'W';
                                    } else if (this.value == 315) {
                                        return 'NW';
                                    }
                                }
                            },

                            plotBands: [{
                                from: 0,
                                to: 600,
                                innerRadius: '25%',
                                outerRadius: '100%',
                                color: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, '#EBD3E2'],
                                        [1, '#EBD3E2'] //yellow  //[1, '#fff']
                                    ]
                                }
                            }],
                            title: {

                            }
                        },
                        series: [{
                            name: 'Compass',
                            data: [90],
                            tooltip: {
                                valueSuffix: ' direction'
                            }
                        }]

                    }
                    var winddirectionchart = new Highcharts.Chart(winddirectionconf);
                    $timeout(function () {
                        scope.$watch('winddir', function (data) {
                            var point = winddirectionchart.series[0].points[0];
                            point.update(data);

                        })
                    });

                }
            }
        }]);

    SensorBoxDirectives.directive('liveWindSpeed', ['$timeout', 'ToolTipDateFormatter',
        function ($timeout, ToolTipDateFormatter) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 live-wind-speed"></div>',
                link: function (scope, elem, attrs) {
                    var panel = {};
                    var viewmode = scope.viewMode;
                    var windspeedconfig = {
                        chart: {
                            //renderTo: 'livewindspeed',
                            type: 'line'

                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: 'Wind Speed (m/s)'
                        },
                        xAxis: {
                            type: 'datetime',
                            lineWidth: 1,
                            labels: {
                                formatter: function () {
                                    return moment(this.value).format(ToolTipDateFormatter[scope.viewMode]);
                                },
                                style: {
                                    'font-size': '8pt',
                                    'color': "#000000"
                                }
                            }
                        },
                        yAxis: [
                            {
                                title: {
                                    text: "Wind Speed(m/s)",
                                    style: {
                                        'color': "#000"
                                    }
                                },
                                labels: {
                                    style: {
                                        "color": "#5472ce",
                                        "font-family": "Roboto-Medium",
                                        "font-size": "10pt"
                                    }
                                },
                                min: 0
                            },
                            {
                                title: {
                                    text: "Wind Direction °",
                                    style: {
                                        'color': "#000"
                                    }
                                },
                                labels: {
                                    style: {
                                        "color": "#b24350",
                                        "font-family": "Roboto-Medium",
                                        "font-size": "10pt"
                                    }
                                },
                                opposite: true,
                                min: 0
                            }
                        ],
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
                                var str = "";
                                str = "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + " </b> </p>";
                                angular.forEach(this.points, function (point, index) {
                                    if (index == 0)
                                        str += "<p class='valuespan'><b>" + point.y.toFixed(2) + " m/s<b></p><p class='titlespan'>" + point.series.name + "</p>";
                                    else
                                        str += "<p class='valuespan'><b>" + point.y.toFixed(2) + " &#176;<b></p><p class='titlespan'>" + point.series.name + "</p>";
                                });
                                return str;
                            }
                        },
                        legend: {
                            layout: 'horizontal',
                            backgroundColor: '#FFFFFF',
                            align: 'center',
                            verticalAlign: 'bottom'
                        },
                        plotOptions: {
                            series: {
                                cropThreshold: 40
                            }
                        },
                        series: [
                            {
                                data: [],
                                //pointWidth: 8,
                                yAxis: 0,
                                name: 'Wind Speed (m/s)',
                                color: '#a4ca4b'
                            },
                            {
                                data: [],
                                //pointWidth: 8,
                                yAxis: 1,
                                name: 'Wind Direction °',
                                color: '#7D7395'
                            }
                        ]
                    };
                    scope.showRefresh = function () {
                        windspeedchart.showLoading();
                    };
                    //var windspeedchart = new Highcharts.Chart(windspeedconfig);
                    $('#livewindspeed').highcharts(windspeedconfig);
                    var windspeedchart = $('#livewindspeed').highcharts();
                    /*$('.js-poa-vs-ap').highcharts(ChartOpts);
                    poaVsApGraph = $('.js-poa-vs-ap').highcharts();*/
                    panel = $(elem);
                    windspeedchart.showLoading();
                    scope.$watch('windspeed', function (data) {
                        if (!$.isEmptyObject(data) && data['DirectionData'].length > 0 && data['data'].length > 0) {
                            viewmode = scope.viewMode;
                            // windspeedchart.xAxis[0].setCategories(data['ts']);
                            windspeedchart.series[0].setData(data['data']);
                            windspeedchart.series[1].setData(data['DirectionData']);
                            if (data.data.length == 1) {
                                windspeedchart.series[0].update({
                                    type: 'bar'
                                });
                                windspeedchart.series[1].update({
                                    type: 'bar'
                                });
                            } else {
                                windspeedchart.series[0].update({
                                    type: 'line'
                                });
                                windspeedchart.series[1].update({
                                    type: 'line'
                                });
                            }
                            console.log('direction data' + angular.toJson(data['DirectionData']));

                            windspeedchart.reflow();
                            windspeedchart.hideLoading();
                        }
                    });


                    panel.find('.panel-refresh').on('click', function () {
                        windspeedchart.showLoading();
                        scope.getData();
                    });
                }
            }
                }]);

    SensorBoxDirectives.directive('humidity', ['$timeout', 'ToolTipDateFormatter',
        function ($timeout, ToolTipDateFormatter) {
            return {
                restrict: "EA",
                scope: false,
                link: function (scope, elem, attrs) {
                    var panel = {};
                    var viewmode = scope.viewMode;
                    var humidityconf = {
                        chart: {
                            renderTo: 'humidity',
                            type: 'area'

                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: 'POA (W/m<sup>2</sup>)'
                        },
                        xAxis: {

                            //categories: [],
                            type: 'datetime',
                            lineWidth: 1,

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
                        exporting: {
                            csv: {
                                dateFormat: "%c"
                            }
                        },
                        yAxis: {
                            title: {
                                text: "POA (W/m2)",
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
                                return "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[viewmode]) + "</b></p><p class='valuespan'><b>" + this.y.toFixed(2) + "  W/m2</b></p><p class='titlespan'>" + this.series.name + "</p>";
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            backgroundColor: '#FFFFFF',

                            align: 'center',

                            verticalAlign: 'bottom'
                        },
                        plotOptions: {
                            series: {
                                cropThreshold: 40
                            }
                        },
                        series: [
                            {
                                data: [],
                                //pointWidth: 8,
                                name: 'POA',
                                color: '#a4ca4b'
                            }
                        ]
                    };
                    scope.showRefresh = function () {
                        humiditychart.showLoading();
                    }

                    var humiditychart = new Highcharts.Chart(humidityconf);
                    panel = $(elem);
                    humiditychart.showLoading();
                    scope.$watch('windpoadata', function (data) {
                        if (!$.isEmptyObject(data) && data['ts'].length > 0 && data['data'].length > 0) {
                            viewmode = scope.viewMode;
                            humiditychart.xAxis[0].setCategories(data['ts']);
                            if (humiditychart.series[0].data.length >= 1) {
                                while (humiditychart.series.length > 0) {
                                    humiditychart.series[0].remove(true);
                                }
                                humiditychart.addSeries({
                                    name: scope.siteName,
                                    color: '#a4ca4b',
                                    data: data['data']

                                });

                                if (data.data.length == 1) {
                                    humiditychart.series[0].update({
                                        type: 'bar'
                                    });
                                }

                            } else {
                                humiditychart.series[0].setData(data['data']);

                            }

                            humiditychart.reflow();
                            humiditychart.hideLoading();
                        }
                    });
                }
            }
        }]);

    return SensorBoxDirectives;
});