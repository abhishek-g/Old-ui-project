/**
 * Created by abhishekgoray on 11/21/14.
 */
//TODO require js configs to go here

require.config({
    baseUrl: "/modules",
    waitSeconds: 20,
    paths: {
        "jquery": "/theme/js/plugins/jquery/jquery.min",
        "jquery-validate": "/theme/js/plugins/jquery-validation/jquery.validate",
        "angular": ["/libs/angular/angular.min", "/libs/angular/angular"],
        "aes": "/libs/aes/aes",
        "async": "/libs/require-plugins/async",
        "json": "/libs/require-plugins/json",
        "text": "/libs/require-plugins/text",
        "underscore": "/libs/underscore/underscore",
        "moment": "/theme/js/plugins/moment.min",
        "oclazyload": "/libs/oclazyload/ocLazyLoad",
        "cookies": ["/libs/cookies/angular-cookies.min", "/libs/cookies/cookies"],
        "angularRouter": "/libs/ui-router/angular-ui-router",
        "angularCarousel": "/libs/carousel/angular-carousel-mm",
        "angularTouch": ["/libs/angular/angular-touch.min", "/libs/angular/angular-touch"],
        "angularUiBootstrap": "/libs/angular/angular-ui-bootstrap",
        "datatables": "/theme/js/plugins/datatables/jquery.dataTables.min",
        "highcharts": "/libs/highcharts/highstocks",
        "highcharts-export": "http://code.highcharts.com/modules/exporting",
        "highcharts-export-excel": ["/libs/highcharts/highchart-export-to-excel", "http://highslide-software.github.io/export-csv/export-csv"],
        "highcharts-more": "http://code.highcharts.com/highcharts-more",
        "highcharts-solidgauge": "http://code.highcharts.com/modules/solid-gauge",
        "ionSlider": "/theme/js/plugins/ion/ion.rangeSlider.min",
        "customScroller": "/theme/js/plugins/mcustomscrollbar/jquery.mCustomScrollbar.min",
        "dateRangePicker": "/theme/js/plugins/daterangepicker/daterangepicker",
        "angularTree": "/libs/tree/angular.treeview",
        "ellipsis": "/libs/ellipsis/js/ellipsis",
        "bootstrapTree": "/libs/tree/bootstrap-treeview",
        "dtPicker": "/theme/js/plugins/bootstrap/bootstrap-datepicker",
        "bootstrap": "/libs/bootstrap/bootstrap",
        "knob": "/theme/js/plugins/knob/jquery.knob.min",
        "bootstrap-picker": "/theme/js/plugins/bootstrap/bootstrap-select"
    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "highcharts": {
            exports: "Highcharts",
            deps: ["jquery"]
        },
        "highcharts-export": {
            exports: "HighchartsExport",
            deps: ["jquery", "highcharts"]
        },
        "highcharts-export-excel": {
            exports: "HighchartsExportExcel",
            deps: ["jquery", "highcharts", "highcharts-export"]
        },
        "highcharts-more": {
            exports: "HighchartsMore",
            deps: ["jquery", "highcharts"]
        },
        "highcharts-solidgauge": {
            exports: "HighchartsSolidgauge",
            deps: ["jquery", "highcharts", "highcharts-more"]
        },
        "dateRangePicker": ["jquery"],
        "datatables": ["jquery"],
        "json": ["text"],
        "jquery-validate": ["jquery"],
        "oclazyload": ["angular"],
        "angularRouter": ["angular"],
        "angularTree": ["angular"],
        "angularCarousel": ["angular", "angularTouch"],
        "cookies": ["angular"],
        "ellipsis": ["jquery"],
        "bootstrapTree": ["jquery"],
        "ionSlider": ["jquery"],
        "angularUiBootstrap": ["angular"],
        "knob": ["jquery"]
    }
});


require(['jquery', 'angular', './app' , './app.templates'], function ($, angular, app) {

    angular.bootstrap(document, ['SolarPulse']);

});