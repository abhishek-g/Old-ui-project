/**
 * Created by abhishekgoray on 5/20/15.
 */

define(function(require){

    require('highcharts');
    var angular = require('angular');
    var _ = require('underscore');

    var uiChartsGraphs =  angular.module('ui-charts-graphs',[]);

    uiChartsGraphs.constant("DateFormats",{
        xAxis:{
            live:"HH:mm",
            hours:"HH:mm",
            days:"DD/MM/YYYY",
            months:"MMM , YYYY",
            years:"YYYY"
        },
        tooltip:{
            live:"DD/MM/YYYY | HH:mm",
            hours:"DD/MM/YYYY | HH:mm",
            days:"DD/MM/YYYY",
            months:"MMM , YYYY",
            years:"YYYY"
        }
    });


    uiChartsGraphs.service("Formatter",function(){

        var viewMode="live";

        function nonDateTooltipFormatter(){
            return '<span class="titlespancol">' + this.series.name + '</span>' +
                    '<span class="valuespancol"><b>' + this.y + '</b></span>';
        }

        function onDateTooltipFormatter(){

        }

        var formatters={simple:nonDateTooltipFormatter,datetime:onDateTooltipFormatter};

        return {
            xAxisFormatter : function(){

            },
            tooltipFormatter : function(){
                return formatters[this.series.chart.userOptions.formatType].call(this);
            }
        }
    });

    uiChartsGraphs.factory("ChartOptions",['Formatter',function(Formatter){
        return {
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            yAxis:{
                min:0,
                gridLineWidth: 1,
                labels:{
                    enabled:false
                }
            },
            xAxis:{
                labels:{
                    enabled:false
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
                y: -16
            },
            tooltip:{
                backgroundColor: null,
                useHTML: true,
                borderWidth: 0,
                style: {
                    padding: 0
                },
                formatter:Formatter.tooltipFormatter
            }
        };
    }]);

    uiChartsGraphs.directive("barGraph",["$timeout","ChartOptions",function($timeout,ChartOptions){
        return {
            replace:true,
            scope:{
                data:"=data",
                options:"=options"
            },
            controller :['$scope',function($scope){
                console.log("Inside Directive---> Controller",$scope);
            }],
            link : function(scope,elem,attrs){
                var options = {chart:{type:"bar"}};
                options = angular.extend(options,scope.options);
                options = angular.extend(options,ChartOptions);

                var PostOpts = {};

                scope.$watch('data',function(data){
                    if (data && data.length > 0) {
                        PostOpts.xAxis[0].setCategories(_.pluck(scope.data,"categories"));
                        PostOpts.series[0].setData(_.pluck(scope.data,"data"));
                        PostOpts.redraw();
                        PostOpts.reflow();
                        PostOpts.hideLoading();
                    }
                },false);


                $timeout(function(){

                    $(elem).highcharts(options);
                    PostOpts = $(elem).highcharts();
                });
            }
        }
    }]);


    return uiChartsGraphs;
});