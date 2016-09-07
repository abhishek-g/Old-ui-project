/**
 * Created by abhishekgoray on 11/27/14.
 */


define(function (require) {

    require('/theme/js/plugins/jquery/jquery-ui.min.js');
    require('/theme/js/plugins/bootstrap/bootstrap.min.js');
    require('datatables');
    require('/theme/js/plugins/icheck/icheck.min.js');
    require('/theme/js/plugins/mcustomscrollbar/jquery.mCustomScrollbar.min.js');
    require('/theme/js/plugins/scrolltotop/scrolltopcontrol.js');
    require('/libs/highcharts/highcharts.js');
    require('/theme/js/plugins/morris/raphael-min.js');
    require('/theme/js/plugins/morris/morris.min.js');
    require('/theme/js/plugins/bootstrap/bootstrap-datepicker.js');
    require('/theme/js/plugins/owl/owl.carousel.min.js');
    require('/theme/js/plugins/moment.min.js');
    require('/theme/js/plugins/ion/ion.rangeSlider.min.js');
    require('/theme/js/plugins/noty/jquery.noty.js');
    require('/theme/js/plugins/noty/themes/default.js');
    require('/theme/js/plugins/noty/layouts/topCenter.js');

    var ThemeDirectory = function () {
        return {
            initPlugin: function () {
                require(['./js/plugins.js'] , function(){

                });
            },
            initActions: function () {
                require(['./js/actions.js'],function(){

                });
            }
        }
    };

    return ThemeDirectory;

});