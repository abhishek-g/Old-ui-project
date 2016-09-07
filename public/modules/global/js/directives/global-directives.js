/**
 * Created by abhishekgoray on 12/3/14.
 */


define(['angular', 'highcharts', 'underscore', 'datatables', 'ionSlider', 'customScroller', 'dateRangePicker'],
    function (angular, _, datatables, ionSlider, customScroller, dateRangePicker) {

        var globalDirectives = angular.module('SolarPulse.Global.Directives', []);

        globalDirectives.directive('ionRangeSlider', ['$timeout',
            function ($timeout) {
                return {
                    restrict: 'EA',
                    scope: {
                        data: '='
                    },
                    templateUrl: "/modules/global/html/partials/ion-range-slider.html",
                    link: function (scope, ele, attrs) {

                        var opts = _.extend({
                            type: 'single',
                            min: 0,
                            max: 100,
                            hide_min_max: true,
                            hide_from_to: true,
                            from_fixed: true,
                            grid: false
                        }, attrs);

                        //                        opts = _.pick(opts, 'type', 'min', 'max', 'hide_min_max', 'hide_from_to', 'from_fixed','grid');

                        $timeout(function () {
                            $(ele).find("input#ise_disabled").ionRangeSlider(_.extend(opts, {
                                from: scope.data['value'] > attrs['max'] ? attrs['max'] : scope.data['value']
                            }));
                        });
                    }
                }
            }]);

        globalDirectives.directive('refresher', ['$timeout', '$rootScope', 'AjaxLoader',
            function ($timeout, $rootScope, AjaxLoader) {
                return {
                    restrict: 'EA',
                    scope: {
                        refreshcallback: '&'
                    },
                    template: "",
                    link: function (scope, elem, attrs) {
                        var panel = $(elem);
                        $timeout(function () {
                            if (attrs.addclass) {
                                panel.find('.panel-controls').append('<li><a href="#" class="panel-refresh" style=" border: none">' +
                                    '<span class="theme-refresh"></span></a></li>');
                            }

                            panel.find('.panel-refresh').on('click', function () {
                                scope.refreshcallback();
                            })

                        });
                    }
                }

        }]);

        globalDirectives.directive('sorter', ['$timeout', function ($timeout) {
            return {
                restrict: "A",
                scope: {
                    filterfn: '&'
                },
                template: "",
                link: function (scope, elem, attrs) {
                    $timeout(function () {

                        $(elem).addClass('theme-sorter-high');
                        var direction = true;
                        $(elem).on('click', function () {
                            $(this).toggleClass('theme-sorter-high').toggleClass('theme-sorter-low');
                            direction = !direction;
                            scope.filterfn({
                                'direction': direction
                            });
                        });

                    });
                }
            }
        }]);

        globalDirectives.directive('upDownSorter', ['$timeout', function ($timeout) {
            return {
                restrict: "A",
                scope: {
                    filterfn: '&'
                },
                template: "<div class='theme-sorter-up'></div><br /><div class='theme-sorter-down'></div>",
                link: function (scope, elem, attrs) {
                    $timeout(function () {});
                }
            }
        }]);

        globalDirectives.directive('datefilternew', ['$timeout', '$rootScope', 'AjaxLoader',
            function ($timeout, $rootScope, AjaxLoader) {
                return {
                    restrict: 'EA',
                    replace: 'true',
                    scope: {
                        setViewMode: '&'
                    },
                    //template:'<li id="reportrange"><a href="#" class="dropdown-toggle no-border"><span class="theme-filterdd"></span></a></li>',
                    link: function (scope, elem, attrs) {
                        var panel = $(elem);
                        $timeout(function () {

                            $(elem).daterangepicker({
                                timePicker: true,
                                ranges: {
                                    'Today': [moment().startOf('day').add(6, 'hours'), moment()],
                                    'Yesterday': [moment().subtract(1, 'days').startOf('day').add(6, 'hours'), moment().subtract(1, 'days').endOf('day')],
                                    'Last 7 Days': [moment().subtract(6, 'days').startOf('day').add(6, 'hours'), moment().endOf('day')],
                                    'Last 6 Months': [moment().subtract(6, 'month').startOf('month').add(6, 'hours'), moment()]
                                },
                                opens: 'left',
                                buttonClasses: ['btn btn-default'],
                                applyClass: 'btn-small btn-primary',
                                cancelClass: 'btn-small',
                                format: 'MM.DD.YYYY',
                                separator: ' to ',
                                startDate: moment().subtract('days', 29),
                                endDate: moment()
                            }, function (start, end, label) {

                                scope.setViewMode({
                                    viewMode: label,
                                    startdate: start,
                                    enddate: end
                                });
                                $(elem).parent().parent().next().find('button').removeClass('btn-success');
                                if (label === 'Today') {
                                    $(elem).parent().parent().next().find('button.live').addClass('btn-success');
                                } else if (label === 'Yesterday') {
                                    $(elem).parent().parent().next().find('button.hours').addClass('btn-success');
                                } else if (label === 'Last 7 Days') {
                                    $(elem).parent().parent().next().find('button.days').addClass('btn-success');
                                } else if (label === 'Last 6 Months') {
                                    $(elem).parent().parent().next().find('button.months').addClass('btn-success');
                                } else {
                                    $(elem).parent().parent().next().find('button.days').addClass('btn-success');
                                }
                            });

                        });
                    }
                }
            }]);

        globalDirectives.directive('groupbychangecall', ['$timeout',
            function ($timeout) {
                return {
                    restrict: 'EA',
                    replace: 'true',
                    scope: {
                        groupByChange: '&'
                    },
                    template: '<div class="btn-group groupbychange">' +
                        '<button type="button" class="btn btn-default btn-success live" data-view="live">Live</button>' +
                        '<button type="button" class="btn btn-default hours" data-view="hours">Hours</button>' +
                        '<button type="button" class="btn btn-default days" data-view="days">Days</button>' +
                        '<button type="button" class="btn btn-default months" data-view="months">Months</button></div>',
                    link: function (scope, elem, attrs) {
                        var panel = $(elem);
                        $timeout(function () {

                            panel.find('button').bind('click', function () {
                                scope.groupByChange({
                                    groupby: $(this).data('view')
                                });
                                $(this).parent().find('button').removeClass('btn-success');
                                $(this).addClass('btn-success');
                            });
                        });
                    }
                }
            }]);

        globalDirectives.directive('exportDropDownBox', ['$timeout', 'AjaxLoader',
            function ($timeout, AjaxLoader) {
                return {
                    restrict: 'EA',

                    template: "",
                    link: function (scope, elem, attrs) {

                        var panel = $(elem);
                        $timeout(function () {
                            if (attrs.addclass) {
                                panel.find('.panel-controls').append('<li><a href="#" class="no-border">' +
                                    '<span class="theme-settings-icon"></span></a></li>');

                            }
                        });
                    }
                }
            }]);

        globalDirectives.directive('customTable', ['$timeout', '$location',
            function ($timeout, $location) {
                return {
                    restrict: 'A',
                    scope: {
                        options: '=',
                        data: '='
                    },
                    templateUrl: "",
                    link: function (scope, ele, attrs) {
                        var oTable = {};
                        var TableApi = {};

                        var opts = {
                            "ordering": false,
                            "info": false,
                            "lengthChange": false,
                            "searching": false,
                            "paging": false,
                            "responsive": true,
                        };

                        $timeout(function () {
                            opts = _.extend(opts, scope.options);
                            oTable = $(ele).dataTable(opts);
                            TableApi = oTable.DataTable();
                            scope.$watch('data', function (data) {
                                if (data.length > 0) {
                                    if (oTable.fnGetData().length > 0) {
                                        TableApi.clear().draw();
                                    }
                                    oTable.fnAddData(data);
                                } else {
                                    if (oTable.fnGetData().length > 0) {
                                        TableApi.clear().draw();
                                    }
                                }
                            });
                        });
                    }
                }
            }]);

        globalDirectives.directive('maximise', ['$timeout',
            function ($timeout) {
                return {
                    restrict: 'C',
                    scope: {},
                    templateUrl: "",
                    link: function (scope, ele, attrs) {
                        $timeout(function () {

                            $(ele).on('click', function () {
                                $(this).toggleClass('theme-maximise').toggleClass('theme-minimise');
                                maximise($(this).parents(".panel"));
                            });

                            $(ele).addClass('theme-maximise');
                        });
                    }
                }
            }]);

        globalDirectives.directive('customFilter', ['$timeout',
            function ($timeout) {
                return {
                    restrict: 'C',
                    scope: {
                        ranges: '=',
                        callback: '&'
                    },
                    templateUrl: "",
                    link: function (scope, ele, attrs) {
                        $timeout(function () {

                            $(ele).daterangepicker({
                                ranges: scope.ranges,
                                opens: 'left',
                                buttonClasses: ['btn btn-default'],
                                applyClass: 'btn-small btn-primary',
                                cancelClass: 'btn-small',
                                format: 'MM.DD.YYYY',
                                separator: '-',
                                startDate: moment().subtract(29, 'days'),
                                endDate: moment()
                            }).on('apply.daterangepicker',
                                function (ev, options) {
                                    count++;
                                    var options = {
                                        e: {
                                            start: options['startDate'],
                                            end: options['endDate']
                                        },
                                        b: options['chosenLabel']
                                    };
                                    scope.fallback({
                                        options: options
                                    })
                                });

                            $(ele).addClass('theme-settings-icon');
                        });
                    }
                }
            }]);

        globalDirectives.directive("scroller", ['$timeout',
            function ($timeout) {
                return {
                    restrict: 'C',
                    scope: {},
                    template: "",
                    link: function (scope, elem, attrs) {
                        var $elem = $(elem);
                        $timeout(function () {
                            $elem.mCustomScrollbar({
                                axis: "yx",
                                autoHideScrollbar: true,
                                scrollInertia: 20,
                                advanced: {
                                    autoScrollOnFocus: false
                                }
                            });
                        });
                        $elem.addClass('scroll');
                    }
                }
            }]);

        globalDirectives.directive("loadResizeAndMenuResize", ['$timeout',
            function ($timeout) {
                return {
                    restrict: "EA",
                    scope: {},
                    template: "",
                    link: function (scope, elem, attrs) {
                        $timeout(function () {

                            onload();

                            $(window).resize(function () {
                                x_navigation_onresize();
                                page_content_onresize();
                            });

                            Object.size = function (obj) {
                                var size = 0,
                                    key;
                                for (key in obj) {
                                    if (obj.hasOwnProperty(key)) size++;
                                }
                                return size;
                            };

                            $(".mb-control").on("click", function () {
                                var box = $($(this).data("box"));
                                if (box.length > 0) {
                                    box.toggleClass("open");

                                    var sound = box.data("sound");

                                    if (sound === 'alert')
                                        playAudio('alert');

                                    if (sound === 'fail')
                                        playAudio('fail');

                                }
                                return false;
                            });

                            $(".mb-control-close").on("click", function () {
                                $(this).parents(".message-box").removeClass("open");
                                return false;
                            });

                            var $leftContentFrame = $(".content-frame-left");
                            $(".content-frame-left-toggle").on("click", function () {
                                $leftContentFrame.is(":visible") ? $leftContentFrame.hide() : $leftContentFrame.show();
                                page_content_onresize();
                            });
                            $(".content-frame-right-toggle").on("click", function () {
                                $leftContentFrame.is(":visible") ? $leftContentFrame.hide() : $leftContentFrame.show();
                                page_content_onresize();
                            });

                            x_navigation();
                        }, 2000);
                    }
                }
            }]);

        globalDirectives.directive("uiInfoWindow", ['$timeout', function ($timeout) {
            return {
                restrict: "EA",
                scope: false,
                template: "<a href='#' class='panel-fullscreen' style='border: none' ><span  class='theme-widget-info'></span></a>",
                link: function (scope, elem, attrs) {
                    $timeout(function () {
                        $(elem).on('click', function (e) {
                            $($(this).data('to-hide-el')).slideToggle(1000);
                        })
                    });
                }
            }
        }]);

        function onload() {
            x_navigation_onresize();
            page_content_onresize();
        }

        function page_content_onresize() {
            $(".page-content,.content-frame-body,.content-frame-right,.content-frame-left").css("width", "").css("height", "");

            var content_minus = 0;
            content_minus = ($(".page-container-boxed").length > 0) ? 40 : content_minus;
            content_minus += ($(".page-navigation-top-fixed").length > 0) ? 50 : 0;

            var content = $(".page-content");
            var sidebar = $(".page-sidebar");

            if (content.height() < $(document).height() - content_minus) {
                content.height($(document).height() - content_minus);
            }

            if (sidebar.height() > content.height()) {
                content.height(sidebar.height());
            }

            if ($(window).width() > 1024) {

                if ($(".page-sidebar").hasClass("scroll")) {
                    if ($("body").hasClass("page-container-boxed")) {
                        var doc_height = $(document).height() - 40;
                    } else {
                        var doc_height = $(window).height();
                    }
                    $(".page-sidebar").height(doc_height);

                }

                if ($(".content-frame-body").height() < $(document).height() - 162) {
                    $(".content-frame-body,.content-frame-right,.content-frame-left").height($(document).height() - 162);
                } else {
                    $(".content-frame-right,.content-frame-left").height($(".content-frame-body").height());
                }

                $(".content-frame-left").show();
                $(".content-frame-right").show();
            } else {
                $(".content-frame-body").height($(".content-frame").height() - 80);

                if ($(".page-sidebar").hasClass("scroll"))
                    $(".page-sidebar").css("height", "");
            }

            if ($(window).width() < 1200) {
                if ($("body").hasClass("page-container-boxed")) {
                    $("body").removeClass("page-container-boxed").data("boxed", "1");
                }
            } else {
                if ($("body").data("boxed") === "1") {
                    $("body").addClass("page-container-boxed").data("boxed", "");
                }
            }
        }

        function maximise(panel) {
            if (panel.hasClass("panel-fullscreened")) {
                panel.removeClass("panel-fullscreened").unwrap();
                panel.find(".panel-body,.chart-holder").css("height", "");
                panel.find(".panel-fullscreen .fa").removeClass("fa-compress").addClass("fa-expand");

                $(window).resize();
            } else {
                var head = panel.find(".panel-heading");
                var body = panel.find(".panel-body");
                var footer = panel.find(".panel-footer");
                var hplus = 30;

                if (body.hasClass("panel-body-table") || body.hasClass("padding-0")) {
                    hplus = 0;
                }
                if (head.length > 0) {
                    hplus += head.height() + 21;
                }
                if (footer.length > 0) {
                    hplus += footer.height() + 21;
                }

                panel.find(".panel-body,.chart-holder").height($(window).height() - hplus);


                panel.addClass("panel-fullscreened").wrap('<div class="panel-fullscreen-wrap"></div>');
                panel.find(".panel-fullscreen .fa").removeClass("fa-expand").addClass("fa-compress");

                $(window).resize();
            }
        }

        function x_navigation_onresize() {

            var inner_port = window.innerWidth || $(document).width();

            if (inner_port < 1025) {
                $(".page-sidebar .x-navigation").removeClass("x-navigation-minimized");
                $(".page-container").removeClass("page-container-wide");
                $(".page-sidebar .x-navigation li.active").removeClass("active");


                $(".x-navigation-horizontal").each(function () {
                    if (!$(this).hasClass("x-navigation-panel")) {
                        $(".x-navigation-horizontal").addClass("x-navigation-h-holder").removeClass("x-navigation-horizontal");
                    }
                });


            } else {
                if ($(".page-navigation-toggled").length > 0) {
                    x_navigation_minimize("close");
                }

                $(".x-navigation-h-holder").addClass("x-navigation-horizontal").removeClass("x-navigation-h-holder");
            }

        }

        function x_navigation_minimize(action) {

            if (action == 'open') {
                $(".page-container").removeClass("page-container-wide");
                $(".page-sidebar .x-navigation").removeClass("x-navigation-minimized");
                $(".x-navigation-minimize").find(".fa").removeClass("fa-indent").addClass("fa-dedent");
                //            $(".page-sidebar.scroll").mCustomScrollbar("update");
            }

            if (action == 'close') {
                $(".page-container").addClass("page-container-wide");
                $(".page-sidebar .x-navigation").addClass("x-navigation-minimized");
                $(".x-navigation-minimize").find(".fa").removeClass("fa-dedent").addClass("fa-indent");
                //            $(".page-sidebar.scroll").mCustomScrollbar("disable",true);
            }

            $(".x-navigation li.active").removeClass("active");

        }

        function x_navigation() {

            $(".x-navigation-control").click(function () {
                $(this).parents(".x-navigation").toggleClass("x-navigation-open");

                onresize();

                return false;
            });

            if ($(".page-navigation-toggled").length > 0) {
                x_navigation_minimize("close");
            }

            $(".x-navigation-minimize").click(function () {

                if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
                    $(".page-container").removeClass("page-navigation-toggled");
                    x_navigation_minimize("open");
                } else {
                    $(".page-container").addClass("page-navigation-toggled");
                    x_navigation_minimize("close");
                }

                onresize();

                return false;
            });

//            $(".x-navigation  li > a").click(function () {
//
//                var li = $(this).parent('li');
//                var ul = li.parent("ul");
//
//                ul.find(" > li").not(li).removeClass("active");
//
//            });
//
//            $(".x-navigation li").click(function (event) {
//                event.stopPropagation();
//
//                var li = $(this);
//
//                if (li.children("ul").length > 0 || li.data('state') === "dashboard" || li.children(".panel").length > 0 || $(this).hasClass("xn-profile") > 0) {
//                    if (li.hasClass("active")) {
//                        li.removeClass("active");
//                        li.find("li.active").removeClass("active");
//                    } else
//                        li.addClass("active");
//
//                    onresize();
//
//                    if ($(this).hasClass("xn-profile") > 0)
//                        return true;
//                    else
//                        return false;
//                }
//            });

            /* XN-SEARCH */
            $(".xn-search").on("click", function () {
                    $(this).find("input").focus();
                })
                /* END XN-SEARCH */

        }

        function onresize(timeout) {
            timeout = timeout ? timeout : 200;

            setTimeout(function () {
                page_content_onresize();
            }, timeout);
        }

        function playAudio(file) {
            if (file === 'alert')
                document.getElementById('audio-alert').play();

            if (file === 'fail')
                document.getElementById('audio-fail').play();
        }

        return globalDirectives;
    });