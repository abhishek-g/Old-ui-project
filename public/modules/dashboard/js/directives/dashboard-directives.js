/**
 * Created by abhishekgoray on 11/27/14.
 */




define(['angular', 'underscore', 'highcharts', 'ellipsis', 'angularTree', 'highcharts-export', 'highcharts-export-excel', 'angularCarousel', 'knob','./../../../../stack/directives/ui-charts-graphs.js'], function (angular, _, highcharts, ellipsis, knob) {
    "use strict";


    var Directives = angular.module('SolarPulse.Dashboard.Directives', ['angularTreeview', 'angular-carousel','ui-charts-graphs']);

    Highcharts.setOptions({
        lang: {
            loading: ""
        },
        global: {
            timezoneOffset: 5 * 60 + 30
        }
    });

    Highcharts.dateFormats = {
        c: function (timestamp) {
            console.log(this);
            return moment(timestamp).format("DD/MM/YYYY  HH:mm");
        }
    };


    Directives.directive('allSitesMap', ['$timeout',
        function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="js-map-container" style="height: 100%;width:100%;"></div>',
                link: function (scope, elem, attrs) {
                    var siteMap = {};
                    var markers = [];
                    $timeout(function () {
                        var mapOptions = {
                            center: new google.maps.LatLng('28.543882', '77.334074'),
                            zoom: 5,
                            streetViewControl: true
                        };

                        siteMap = new google.maps.Map($('.js-map-container')[0], mapOptions);

                        var image = {
                            url: '/modules/dashboard/css/img/Marker06_100.png'
                        };

                        var imageGreen = {
                            url: '/modules/dashboard/css/img/Marker02_200.png'
                        };
                        var toStopWatcher = scope.$watch('Details', function (data) {
                            if (!$.isEmptyObject(data)) {
                                //console.log("")
                                angular.forEach(data.sites, function (site) {
                                    var marker1 = new google.maps.Marker({
                                        animation: google.maps.Animation.DROP,
                                        position: new google.maps.LatLng(site['latlng'][0], site['latlng'][1]),
                                        title: site['siteName'],
                                        icon: image
                                    });

                                    marker1.setMap(siteMap);
                                    var zoomLevel = siteMap.zoom;
                                    google.maps.event.addListener(marker1, 'dblclick', function () {
                                        zoomLevel = siteMap.zoom;
                                        if (siteMap.zoom <= 17) {
                                            siteMap.setZoom(++zoomLevel);
                                            siteMap.setCenter(marker1.getPosition());
                                        } else {
                                            $.noop();
                                        }
                                    });

                                    siteMap.setCenter(marker1.getPosition());

                                    google.maps.event.addListener(marker1, 'mouseover', function () {
                                        marker1.setIcon(imageGreen);
                                    });

                                    google.maps.event.addListener(marker1, 'mouseout', function () {
                                        marker1.setIcon(image);
                                    });

                                    markers.push(marker1);
                                });
                                toStopWatcher();
                                scope.areMarkersReady = true;
                            }
                        });

                        $('.js-panel-map').on('click', function () {
                            $timeout(function () {
                                $('.js-map-panel-body').css('height', '418px');
                                google.maps.event.trigger(siteMap, 'resize');
                            });
                        });
                    });
                    $timeout(function () {
                        $(document).resize();
                    }, 500);
                }
            };
        }]);

    Directives.directive('highAlertAlarms', ['$timeout', 'AjaxLoader',
        function ($timeout, AjaxLoader) {
            return {
                restrict: "EA",
                scope: false,
                templateUrl: '/modules/dashboard/html/partials/all-sites/high-alert-alarms.html',
                link: function (scope, elem, attrs) {

                }
            };
        }]);

    Directives.directive('prComparisons', ['$timeout', 'AjaxLoader',
        function ($timeout, AjaxLoader) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-pr-compare scroller"></div>',
                link: function (scope, elem, attrs) {
                    var chartOpts = {};

                    var ChartPreOpts = {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: "Performance Ratio"
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            categories: [],
                            lineWidth: 1,
                            gridLineWidth: 0,
                            labels: {
                                enable: false
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Performance(%)'
                            },
                            lineWidth: 1,
                            gridLineWidth: 1,
                            labels: {
                                enabled: true
                            },
                            min: 0
                        },
                        legend: {
                            enabled: false,
                            floating: true,
                            align: 'left',
                            layout: 'horizontal',
                            verticalAlign: 'top',
                            symbolRadius: 5,
                            symbolWidth: 12,
                            y: -16
                        },
                        tooltip: {
                            backgroundColor: null,
                            useHTML: true,
                            borderWidth: 0,
                            style: {
                                padding: 0
                            },
                            formatter: function () {
                                return '<b><p class="valuespan">' + this.y.toFixed(2) + ' %</p></b><p class="titlespan">' + this.series.name + '</p>';
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
                                name: 'Performance',
                                color: '#F7A35C'
                            }
                        ]
                    };

                    $timeout(function () {
                        $('.js-pr-compare').highcharts(ChartPreOpts);

                        chartOpts = $('.js-pr-compare').highcharts();
                        chartOpts.showLoading();
                        scope.$watch('formattedpr', function (data) {
                            if (data && data.length > 0) {
                                var categories = _.pluck(data, 'subject');
                                var yieldValues = _.pluck(data, 'value');
                                chartOpts.xAxis[0].setCategories(categories);
                                chartOpts.series[0].setData(yieldValues);
                                chartOpts.redraw();
                                chartOpts.reflow();
                                chartOpts.hideLoading();
                            }
                        });
                    });


                }
            };
        }]);

    Directives.directive('sitesTable', ['$timeout', 'AjaxLoader',
        function ($timeout, AjaxLoader) {
            return {
                restrict: "EA",
                scope: false,
                templateUrl: '/modules/dashboard/html/partials/all-sites/sites-overview.html',
                link: function (scope, elem, attrs) {
                    scope.options = {};

                    var columnDefs = [
                        {
                            targets: [0],
                            sWidth: '20%',
                            mData: 'siteName'
                        },
                        {
                            targets: [1],
                            sWidth: '16%',
                            mData: 'installedCapacity'
                        },
                        {
                            targets: [2],
                            sWidth: '18%',
                            mData: 'todayGeneration',
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

                        var fromSlider = $(".js-today-gen-slider");

                        fromSlider.each(function (e, el) {
                            var from = $(el).data("from");
                            if (!from) {
                                $(el).prev().find('.irs-bar-edge').css('width', '0px');
                            }
                        });
                    }

                    function formatTodayGeneration(a, b, c) {

                        var t = (c.todayGeneration === 0) ? 0 : c.todayGeneration.toFixed(2);

                        var ionslider = '<input class="js-today-gen-slider" type="hidden" data-from-fixed="true"  data-hide-min-max="true" data-hide-from-to="true" ' +
                            'data-type="single" data-min="0" data-step="30" data-from="' + t +
                            '" data-max="' + c.installedCapacity + '">';

                        return "<span class='col-md-4'>" + a.toFixed(2) + "</span>" + "<span class='col-md-8 theme-today-gen'>" + ionslider + "</span>";
                    }

                    function formatPoaEnergy(a, b, c) {
                        if (!a) {
                            return "-";
                        }
                        return "<span class=''>" + a.toFixed(2) + "</span>";
                    }

                    function formatTodayYield(a, b, c) {
                        return "<span style='background:#3896B0;color:#fff;padding:3px 5px;border-radius:3px;'>" + a.toFixed(2) + "</span>";
                    }

                    function formatCuf(a) {
                        return '<span style="background:#63A143;color:#fff;padding:3px 5px;border-radius:3px;">' + a.toFixed(2) + '</span>';
                    }

                }
            };
        }]);

    Directives.directive('spYieldComparisons', ['$timeout', 'AjaxLoader',
        function ($timeout, AjaxLoader) {
            return {
                restrict: "EA",
                scope: false,
                template: '<div class="col-md-12 js-sp-yield-compare scroller"></div>',
                link: function (scope, elem, attrs) {
                    var chartOpts = {};

                    var ChartPreOpts = {
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: null
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            categories: [],
                            lineWidth: 1,
                            gridLineWidth: 0,
                            title: {
                                text: ''
                            },
                            labels: {
                                rotation: 270,
                                enabled: true
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Specific Energy'
                            },
                            lineWidth: 1,
                            gridLineWidth: 1,
                            labels: {
                                enabled: true
                            },
                            min: 0
                        },
                        legend: {
                            enabled: false,
                            floating: true,
                            align: 'left',
                            layout: 'horizontal',
                            verticalAlign: 'top',
                            symbolRadius: 5,
                            symbolWidth: 12,
                            y: -16
                        },
                        tooltip: {
                            backgroundColor: null,
                            useHTML: true,
                            borderWidth: 0,
                            style: {
                                padding: 0
                            },
                            formatter: function () {
                                return '<span class="titlespancol">' + this.series.name + '</span>' +
                                    '<span class="valuespancol"><b>' + this.y + '</b></span>'
                            }
                        },
                        series: [
                            {
                                data: [],
                                dataLabels: {
                                    align: 'left',
                                    inside: true,
                                    formatter: function () {
                                        return '<b>' + this.y + '</b>';
                                    },
                                    enabled: true
                                },
                                name: 'Specific Energy',
                                color: '#3896B0'
                            }
                        ]
                    };

                    $timeout(function () {
                        $('.js-sp-yield-compare').highcharts(ChartPreOpts);

                        chartOpts = $('.js-sp-yield-compare').highcharts();
                        chartOpts.showLoading();
                        scope.$watch('formattedSPYield', function (data) {
                            if (data && data.length > 0) {
                                var categories = _.pluck(data, 'subject');
                                var yieldValues = _.pluck(data, 'value');
                                chartOpts.xAxis[0].setCategories(categories);
                                chartOpts.series[0].setData(yieldValues);
                                chartOpts.redraw();
                                chartOpts.reflow();
                                chartOpts.hideLoading();
                            }
                        });
                    });
                }
            };
        }]);

    Directives.directive('weatherDetails', ['$timeout', 'AjaxLoader',
        function ($timeout, AjaxLoader) {
            return {
                restrict: "EA",
                scope: false,
                templateUrl: '/modules/dashboard/html/partials/all-sites/sites-weather.html',
                link: function (scope, elem, attrs) {}
            };
        }]);

    Directives.directive('spPowerComparisons', ['$timeout',
            function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                templateUrl: '/modules/dashboard/html/partials/all-sites/sp-power-comparisons.html',
                link: function (scope, elem, attrs) {}
            }
    }]);

    Directives.directive("exportHighcharts", ['$timeout', function ($timeout) {
        return {
            restrict: "EA",
            scope: false,
            template: '<a href="#" style="border:none" class="panel-fullscreen">' +
                '<span class="theme-export-icon"></span></a>',
            link: function (scope, elem, attrs) {
                var $elem = $(elem);
                $elem.find('.theme-export-icon').on('click', function () {
                    var $parent = $elem.closest('.panel').find('.panel-body');
                    $parent.find('.highcharts-button').trigger('click');
                });

            }
        }
    }]);

//    Directives.directive("globalDatePicker", ['$timeout', '$rootScope', function ($timeout, $rootScope) {
//        return {
//            restrict: "A",
//            scope: false,
//            template: '<input type="text" class="form-control" id="datePicker"></div>',
//            link: function (scope, elem, attrs) {
//                $timeout(function () {
//                    var $elem = $(elem).find('#datePicker');
//                    $elem.val(moment().format('DD/MM/YYYY'));
//                    $elem.datepicker({
//                            autoclose: true,
//                            format: 'dd/mm/yyyy',
//                            startDate: new Date(moment().subtract(5, 'months').format("DD/MM/YYYY")),
//                            endDate: new Date(),
//                            todayHighlight: true
//                        })
//                        .on('changeDate', function (e) {
//                            $rootScope.$broadcast("dateChanged", e.date);
//                        });
//                });
//            }
//        }
//    }]);

    Directives.directive('tableExport', ['$timeout', function ($timeout) {
        return {
            restrict: "A",
            scope: false,
            templateUrl: "/modules/dashboard/html/partials/single-site/table-export.html",
            link: function (scope, elem, attrs) {
                $timeout(function () {

                    var $ele = $(elem);
                    $ele.on('click', function (e) {
                        $ele.toggleClass('open');
                    });

                    var tableId = $ele.data('table-id');
                    var ignoreColumns = $ele.data('ignore-column');
                    var $li = $ele.find('.export-ele');

                    $li.on('click', function (e) {
                        $li.removeClass('active');
                        var type = $(this).data('type');
                        $('#' + tableId).tableExport({
                            type: type,
                            escape: 'false',
                            separator: ',',
                            ignoreColumn: ignoreColumns,
                            tableName: 'TableName'
                        });
                    });

                })
            }
        }
    }]);

    return Directives;
});