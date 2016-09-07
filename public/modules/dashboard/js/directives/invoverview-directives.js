/**
 * Created by abhishekgoray on 1/12/15.
 */
define(['angular', 'datatables', 'moment', "highcharts-solidgauge"], function (angular, datatables, moment) {

    var Directives = angular.module('SolarPulse.InvOverview.Directives', []);

    Directives.directive("inverterTable", ['$timeout', function ($timeout) {
        return {
            restrict: "A",
            scope: false,
            templateUrl: "/modules/dashboard/html/partials/inverters/inverter-table.html",
            link: function (scope, elem, attrs) {
                var oTable = {};
                var TableApi = {};

                var options = {
                    "ordering": false,
                    "info": false,
                    "lengthChange": false,
                    "searching": false,
                    "paging": false,
                    "responsive": true,
                    columnDefs: [
                        {
                            targets: [0],
                            mData: "displayName",
                            render: function (a, b, c) {
                                return a;
                            }
                        },
                        {
                            targets: [1],
                            mData: "power",
                            render: function (a, b, c) {
                                return "<span class='theme-inv-data'>" + a.toFixed(2) + "  kW" + "</span>";

                            }
                        },
                        {
                            targets: [2],
                            mData: "spYield",
                            render: function (a) {
                                var t = (a === 0) ? 0 : a.toFixed(2);

                                var ionslider = '<input class="js-slider" type="hidden" data-from-fixed="true"  ' +
                                    'data-hide-min-max="true" data-hide-from-to="true" ' +
                                    'data-type="single" data-min="0" data-step="1" data-from="' + t +
                                    '" data-max="' + 10 + '">';

                                return "<span class='col-md-4 theme-inv-data'>" + a.toFixed(2) + "</span>" +
                                    "<span class='col-md-8 theme-today-gen'>" + ionslider + "</span>";
                            }
                        },
                        {
                            targets: [3],
                            mData: "efficiency",
                            render: function (a) {
                                return "<span class='theme-table-data'>" + a.toFixed(2) + "</span>";
                            }
                        },
                        {
                            targets: [4],
                            mData: "alarmCount",
                            render: function (a) {
                                return "<span class='theme-table-data'>" + a + "</span>";
                            }
                        },
                        {
                            targets: [5],
                            mData: "dcCapacity",
                            render: function (a) {
                                return "<span class='theme-table-data'>" + a + "</span>";
                            }
                        }

                    ],
                    "fnRowCallback": function (tr, data) {
                        $(tr).attr('inverterId', data['deviceSn']);
                    },
                    "fnDrawCallback": function () {
                        $(".js-slider").ionRangeSlider();
                    }
                };

                $timeout(function () {
                    oTable = $('#DataTables_Table_inverterdata').dataTable(options);
                    TableApi = oTable.DataTable();
                    scope.$watch('inverterData', function (data) {
                        if (data && data.length > 0) {
                            oTable.fnAddData(data);
                            $("#DataTables_Table_inverterdata tbody tr:first").addClass('selected');

                            $("#DataTables_Table_inverterdata tbody tr").on('click', function (e) {
                                $("#DataTables_Table_inverterdata tbody tr").removeClass('selected');
                                $(e.currentTarget).toggleClass('selected');
                                scope.updateElements($(e.currentTarget).attr('inverterId'));
                            });

                        } else {
                            if (oTable.fnGetData().length > 0) {
                                TableApi.clear().draw();
                            }
                        }
                    });
                });

                $timeout(function () {
                    $(document).resize();
                }, 300);
            }
        }
    }]);


    Directives.directive("inverterDcAcCompare", ['$timeout', 'ToolTipDateFormatter', function ($timeout, ToolTipDateFormatter) {
        return {
            restrict: "A",
            scope: false,
            template: "<div class='js-dc-ac-compare'></div>",
            link: function (scope, elem, attrs) {
                var $elem = $('.js-dc-ac-compare');
                var chartOpts = {};
                var viewmode = scope.viewMode;
                var config = {
                    chart: {
                        zoomType: 'xy'
                    },
                    credits: {
                        enabled: false
                    },
                    rangeSelector: {
                        enabled: false
                    },
                    title: {
                        text: "Pv vs Active Power"
                    },
                    navigator: {
                        margin: 2,
                        adaptToUpdatedData: true,
                        outlineColor: 'black',
                        outlineWidth: 1,
                        maskInside: false,
                        handles: {
                            backgroundColor: 'yellow',
                            borderColor: 'black'
                        },
                        series: {
                            includeInCSVExport: false
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            formatter: function () {
                                return moment(this.value).format(ToolTipDateFormatter[scope.viewMode]);
                            }
                        }
                    },
                    yAxis: [
                        {
                            title: {
                                text: "PV Power"
                            },
                            labels: {
                                style: {
                                    "font-family": "Roboto-Medium"
                                },
                                format: '{value} kW'
                            },
                            min: 0
                        },
                        {
                            title: {
                                text: "Active Power"
                            },
                            labels: {
                                style: {
                                    "font-family": "Roboto-Medium"
                                },
                                format: '{value} kW'
                            },
                            min: 0,
                            opposite: true
                        }
                    ],
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
                            for (var i = 0; i < this.points.length; i++) {
                                str += "<b><p class='valuespan'>" + this.points[i].y.toFixed(1) + "</p><b><p class='titlespan'>" + this.points[i].series.name + " kW</b></p>";
                            }
                            return str;

                        }
                    },
                    exporting: {
                        csv: {
                            dateFormat: "%c"
                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                radius: 3
                            }
                        }
                    },
                    legend: {
                        enabled: true,
                        floating: false,
                        align: 'center',
                        layout: 'horizontal',
                        verticalAlign: 'bottom',
                        symbolRadius: 7,
                        symbolWidth: 7

                    },
                    series: [
                        {
                            name: 'Pv Power',
                            data: [],
                            color: "#f46520",
                            marker: {
                                fillColor: '#f46520'
                            },
                            y: 0
                        },
                        {
                            name: 'Active Power',
                            data: [],
                            color: "#995dc5",
                            marker: {
                                fillColor: '#995dc5'
                            },
                            y: 1
                        }
                    ]
                };

                scope.showLoading = function () {
                    if (!$.isEmptyObject(chartOpts)) {
                        chartOpts.showLoading();
                    }
                };
                scope.hideLoading = function () {
                    if (!$.isEmptyObject(chartOpts)) {
                        chartOpts.hideLoading();
                    }
                };
                scope.showRefresh = function () {
                    chartOpts.showLoading();
                };
                $timeout(function () {
                    $elem.highcharts('StockChart', config);
                    chartOpts = $elem.highcharts();
                    /* Zoom reset Code */
                    function resetChartZoom() {
                        chartOpts.zoomOut();
                    }
                    $('#dcAcRst').click(function () {
                        resetChartZoom();
                    });
                    /* Zoom reset Code Ends*/
                    chartOpts.showLoading();

                    scope.$watch('AcDcData', function (acDc) {
                        //console.log('ac dc data ', acDc);
                        if (!$.isEmptyObject(acDc)) {
                            viewmode = scope.viewMode;
                            chartOpts.series[0].setData(acDc['pv']['values']);
                            chartOpts.series[1].setData(acDc['ap']['values']);
                            chartOpts.reflow();
                            chartOpts.hideLoading();
                        }
                    });
                });
            }
        }
    }]);
    /*single inverter AC DC compare*/

    Directives.directive("inverterEfficiencyCurve", ['$timeout', 'ToolTipDateFormatter', function ($timeout, ToolTipDateFormatter) {
        return {
            restrict: "A",
            scope: false,
            template: "<div class='js-eff-data'></div>",
            link: function (scope, elem, attrs) {
                var $elem = $('.js-eff-data');
                var chartOpts = {};
                var viewmode = scope.viewMode;
                var config = {
                    chart: {
                        zoomType: 'xy'
                    },
                    credits: {
                        enabled: false
                    },
                    rangeSelector: {
                        enabled: false
                    },
                    title: {
                        text: "Inverter Efficiency Curve"
                    },
                    navigator: {
                        margin: 2,
                        adaptToUpdatedData: true,
                        outlineColor: 'black',
                        outlineWidth: 1,
                        maskInside: false,
                        handles: {
                            backgroundColor: 'yellow',
                            borderColor: 'black'
                        },
                        series: {
                            includeInCSVExport: false
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            formatter: function () {
                                return moment(this.value).format(ToolTipDateFormatter[scope.viewMode]);
                            }
                        }
                    },
                    exporting: {
                        csv: {
                            dateFormat: "%c"
                        }
                    },
                    yAxis: [
                        {
                            title: {
                                text: "Efficiency"
                            },
                            labels: {
                                style: {
                                    "font-family": "Roboto-Medium"
                                },
                                format: '{value} %'
                            },
                            min: 0
                        }
                    ],
                    tooltip: {
                        shared: true,
                        backgroundColor: null,
                        useHTML: true,
                        borderWidth: 0,
                        style: {
                            padding: 0
                        },
                        formatter: function () {

                            var str = "<p class='timevaluespan'><i class='fa fa-clock-o' style='font-size:14px;'></i><b> " + moment(this.x).format(ToolTipDateFormatter[scope.viewMode]) + " </b> </p>";
                            for (var i = 0; i < this.points.length; i++) {
                                str += "<b><p class='valuespan'>" + this.points[i].y.toFixed(1) + " %</p><b><p class='titlespan'>" + this.points[i].series.name + "</b></p>";
                            }
                            return str;

                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                radius: 2
                            },
                            connectNulls: true
                        }
                    },
                    legend: {
                        enabled: true,
                        floating: false,
                        align: 'center',
                        layout: 'horizontal',
                        verticalAlign: 'bottom',
                        symbolRadius: 7,
                        symbolWidth: 7
                            /*y: 1,
                             x: 50*/
                    },
                    series: [
                        {
                            name: 'Efficiency',
                            data: [],
                            color: "#f46520",
                            marker: {
                                fillColor: '#f46520'
                            },
                            y: 0
                        }
                    ]
                };

                scope.showLoading = function () {
                    if (!$.isEmptyObject(chartOpts)) {
                        chartOpts.showLoading();
                    }
                };

                scope.hideLoading = function () {
                    if (!$.isEmptyObject(chartOpts)) {
                        chartOpts.hideLoading();
                    }
                };
                scope.showRefresh = function () {
                    chartOpts.showLoading();
                }


                $timeout(function () {
                    $elem.highcharts('StockChart', config);
                    chartOpts = $elem.highcharts();
                    /* Zoom reset Code */
                    function resetChartZoom() {
                        chartOpts.zoomOut();
                    }
                    $('#effRst').click(function () {
                        resetChartZoom();
                    });
                    /* Zoom reset Code Ends*/

                    chartOpts.showLoading();

                    scope.$watch('InvEffData', function (acDc) {
                        console.log(acDc);
                        if (!$.isEmptyObject(acDc)) {
                            viewmode = scope.viewMode;
                            chartOpts.series[0].setData(acDc['Effdata']['values']);
                            if (acDc['Effdata']['values'].length == 1) {
                                chartOpts.series[0].update({
                                    type: 'bar'
                                });
                            } else {
                                chartOpts.series[0].update({
                                    type: 'line'
                                });
                            }
                            chartOpts.reflow();
                            chartOpts.hideLoading();
                        }
                    });
                });
            }
        }
    }]);


    Directives.directive("activePowerGauge", ['$timeout', function ($timeout) {
        return {
            restrict: "A",
            scope: false,
            template: "<div class='js-activePowerGauge'></div>",
            link: function (scope, elem, attrs) {
                var PostConfig = {};
                var config = {
                    chart: {
                        type: 'solidgauge'
                    },
                    title: "Active Power",
                    pane: {
                        center: ['50%', '85%'],
                        size: '130%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {
                            backgroundColor: '#EEE',
                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                    },
                    tooltip: {
                        enabled: true
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: 5,
                                borderWidth: 0,
                                useHTML: true
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Active Power',
                            y: 10
                        },
                        stops: [
                            [0.25, '#DF5353'],
                            [0.5, '#DDDF0D'],
                            [0.75, '#55BF3B']
                        ],
                        min: 0,
                        max: 25,
                        lineWidth: 0,
                        minorTickInterval: null,
                        labels: {
                            y: 16,
                            format: '{value} kW'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            name: 'Active Power',
                            data: [],
                            tooltip: {
                                valueSuffix: 'kW'
                            }
                        }
                    ]

                };


                scope.showLoading = function () {
                    if (!$.isEmptyObject(PostConfig)) {
                        PostConfig.showLoading();
                    }
                };

                scope.hideLoading = function () {
                    if (!$.isEmptyObject(PostConfig)) {
                        PostConfig.hideLoading();
                    }
                };

                $timeout(function () {
                    var $elem = $('.js-activePowerGauge');
                    $elem.highcharts(config);
                    PostConfig = $elem.highcharts();
                    PostConfig.showLoading();
                    scope.$watch('activePower', function (data) {
                        if (data || data === 0) {
                            PostConfig.series[0].setData([parseFloat(data)]);
                            PostConfig.hideLoading();
                            PostConfig.reflow();
                        }
                    });

                });
            }
        }
    }]);

    return Directives;
});