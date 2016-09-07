/**
 * Created by abhishekgoray on 2/10/15.
 */
define(["angular", "highcharts-solidgauge", 'angularCarousel'], function (angular) {

    var Directives = angular.module('SolarPulse.Gmeter.Directives', ['angular-carousel']);

    Directives.directive('reactivePowerGauge', ['$timeout', function ($timeout) {
        return {
            restrict: "A",
            scope: false,
            template: "",
            link: function (scope, elem, attrs) {

                var Gauge = new MakeGauge(scope);

                $timeout(function () {
                    Gauge.init({
                        name: "Reactive Power",
                        max: 1000,
                        unit: " kVAR"
                    }, $(elem));
                    Gauge.showLoading();
                    scope.$watch('reactivePower', function (value) {
                        if (value || value === 0) {
                            Gauge.updateYAxis(-150, scope.Zone.meta.capacity.value);
                            Gauge.update([value]);
                            Gauge.hideLoading();
                        }
                    });
                });
            }
        }
    }]);

    Directives.directive('powerGauge', ['$timeout', function ($timeout) {
        return {
            restrict: "A",
            scope: false,
            template: "",
            link: function (scope, elem, attrs) {
                var Gauge = new MakeGauge(scope);

                $timeout(function () {
                    Gauge.init({
                        name: "Active Power",
                        max: 1000,
                        unit: " kW"
                    }, $(elem));
                    Gauge.showLoading();
                    scope.$watch('activePower', function (value) {
                        if (value || value < 0) {
                            Gauge.updateYAxis(-25, scope.Zone.meta.capacity.value);
                            Gauge.update([parseFloat(value.toFixed(1))]);
                            Gauge.hideLoading();
                        }
                    });
                });
            }
        }
    }]);

    Directives.directive('apparentPowerGauge', ['$timeout', function ($timeout) {
        return {
            restrict: "A",
            scope: false,
            template: "",
            link: function (scope, elem, attrs) {
                var Gauge = new MakeGauge(scope);

                $timeout(function () {
                    Gauge.init({
                        name: "Apparent Power",
                        max: 1000,
                        unit: " kVA"
                    }, $(elem));
                    Gauge.showLoading();
                    scope.$watch('apparentPower', function (value) {
                        if (value) {
                            Gauge.updateYAxis(0, scope.Zone.meta.capacity.value);
                            Gauge.update([value]);
                            Gauge.hideLoading();
                        }
                    });
                });
            }
        }
    }]);

    function MakeGauge(scope) {

        var config = {
            chart: {
                type: 'solidgauge',
                height: 200
            },
            title: null,
            pane: {
                center: ['50%', '96%'],
                size: '140%',
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
                        useHTML: true,
                        style: {
                            color: "#42515a",
                            fontSize: "10pt",
                            fontFamily: "Roboto-Regular"
                        }
                    }
                }
            },
            yAxis: {
                title: {
                    text: '',
                    y: 40
                },
                stops: [
                    [0.25, '#DF5353'],
                    [0.5, '#DDDF0D'],
                    [0.75, '#55BF3B']
                ],
                minorTickInterval: null,
                labels: {
                    y: 16,
                    format: '{value}',
                    style: {
                        color: "#42515a",
                        fontSize: "12pt"
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    data: [],
                    tooltip: {
                        valueSuffix: 'kW'
                    }
                }
            ]

        };
        var ChartOpts = {};

        return {
            init: function (opts, elem) {
                config.yAxis.max = opts.max;
                config.series[0].tooltip.valueSuffix = " " + opts.unit;
                config.series[0].name = opts['name'];
                $(elem).highcharts(config);
                ChartOpts = $(elem).highcharts();
            },
            update: function (data) {
                ChartOpts.series[0].setData(data);
            },
            updateYAxis: function (min, max) {
                ChartOpts.yAxis[0].update({
                    min: Math.ceil(min / 50) * 50,
                    max: Math.ceil(max / 50) * 50
                });
            },
            showLoading: function () {
                ChartOpts.showLoading();
            },
            hideLoading: function () {
                ChartOpts.hideLoading();
            }
        }

    }


    return Directives;
});