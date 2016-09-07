/**
 * Created by abhishekgoray on 6/2/15.
 */

define(function (require) {

    var _ = require('underscore');
    var $ = require('jquery');
    require('highcharts');
    var moment = require('moment');

    function Chart(options) {
        this.el = getEl(options.el);
        this.defProps = {
            credits: {
                enabled: false
            },
            exporting: {
                csv: {
                    dateFormat: "%c"
                }
            }
        };
        this.options = options;
        this.helper = new ChartHelper();
        this.chart = {};
        this.viewMode = 'live';

    }

    function ChartHelper() {
        return {
            generateXAxis: function (options) {
                var xAxis = {};
                if (options.xAxis.type && options.xAxis.type == "datetime") {
                    xAxis.type = "datetime";
                } else {
                    xAxis.categories = options.xAxis.categories && options.xAxis.categories.length > 0 ? options.xAxis.categories : [];
                }
                xAxis.labels = {};
                xAxis.labels.formatter = options.xAxisFormatter;
                xAxis.labels.style = {
                    "color": "#000",
                    "font-family": "Roboto-Medium",
                    "font-size": "10pt"
                };
                return _.extend(xAxis, options.xAxis.opts);
            },
            generateYAxis: function (options) {
                var yAxes = [];
                _.each(options.yAxis, function (yAx) {

                    yAx = _.extend({
                        title: {
                            text: yAx.name,
                            style: {
                                "color": "#000",
                                "font-family": "Roboto-Medium",
                                "font-size": "10pt"
                            }
                        },
                        label: {
                            style:{
                                "color": "#000",
                                "font-family": "Roboto-Medium",
                                "font-size": "10pt"
                            }
                        }
                    }, yAx.opts);
                    yAx.min = 0;
                    yAxes.push(yAx);
                });
                return yAxes;
            },
            generateTootltip: function (options) {
                return  {
                    shared: true,
                    backgroundColor: null,
                    useHTML: true,
                    borderWidth: 0,
                    style: {
                        padding: 0
                    },
                    formatter: options.tooltipFormatter
                };
            },
            generateLegend: function (options) {
                return _.extend({
                    enabled: true,
                    floating: false,
                    align: 'center',
                    layout: 'horizontal',
                    verticalAlign: 'bottom',
                    symbolRadius: 5,
                    symbolWidth: 10,
                    itemStyle: {
                        color: '#000000',
                        fontSize: "12pt"
                    }
                }, options.legend ? options.legend : {});
            }
        }
    }

    Chart.prototype.renderChart = function () {

        var self = this;

        try {

            self.opts = _.defaults(self.defProps, {
                chart: {
                    renderTo: self.el,
                    zoomType:'xy'
                },
                title: {
                    text: self.options.chartTitle
                }
            });

            self.opts.xAxis = self.helper.generateXAxis(self.options);
            self.opts.yAxis = self.helper.generateYAxis(self.options);
            self.opts.legend = self.helper.generateLegend(self.options);
            self.opts.tooltip = self.helper.generateTootltip(self.options);
            self.opts.series = self.options.series;

            self.chart = new Highcharts.Chart(self.opts);
        }
        catch (e) {
            console.log(e);
        }

    };

    Chart.prototype.updateChart = function (chartType) {
        var self = this;
        self.opts.chart.type = chartType.toLowerCase();
        self.chart = new Highcharts.Chart(self.opts);
    };

    Chart.prototype.updateData = function (series, categories, viewMode) {
        var self = this;
        this.viewMode = viewMode;
        if (categories) {
            self.chart.xAxis[0].setCategories(categories);
        }
        _.each(series, function (ser, index) {
            self.chart.series[index].setData(ser.data);
        });
    };

    Chart.prototype.removeSeries = function(){
        var self = this;
        while(self.chart.series.length > 0){
            self.chart.series[0].remove();
        }
    };

    Chart.prototype.addSeries =function(series){
        var self = this;
        self.removeSeries();
        _.each(series,function(ser){

            if(ser.data.length === 1){
                ser.type='column';
            }
            self.chart.addSeries(ser);
        })
    };

    function getEl(el) {
        if (_.isString(el)) {
            return $(el);
        } else if (_.isElement(el)) {
            return el;
        } else {
            return {};
        }
    }

    return Chart;
});

