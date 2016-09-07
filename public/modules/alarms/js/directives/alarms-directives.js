/**
 * Created by abhishekgoray on 12/3/14.
 */



define(['angular', 'underscore', 'datatables', 'bootstrapTree', './pipelinePlugin.js', 'bootstrap'], function (angular, _, datatables) {

    var alarmsDirectives = angular.module('SolarPulse.Alarms.Directives', []);



    alarmsDirectives.directive('alarmsList', ['$timeout', 'UrlRepository', function ($timeout, UrlRepository) {
        return {
            restrict: "EA",
            scope: false,
            templateUrl: "/modules/alarms/html/partials/alarms-list.html",
            link: function (scope, elem, attrs) {
                var oTable = {};
                var TableApi = {};
                var opts = {
                    "ordering": true,
                    "info": true,
                    "lengthChange": false,
                    "searching": true,
                    "pageLength": 20,
                    responsive: true

                };
                var sitenames = new Object();
                var zonenames = new Object();
                var username = scope.User.user.fullname[0].toUpperCase() + scope.User.user.fullname.slice(1);
                scope.options = {};
                var alarmIds = [];
                scope.el;
                var arrayTrs = []
                var paginationConfig = {
                    pagination: {
                        required: 1,
                        pageNumber: 1

                    }
                }

                var columnDefs = [
                    {
                        targets: [0],
                        render: function (a) {
                            return "<input type='checkbox' class='js-check' data-alarmId=" + a + "></span>";
                        },
                        'bSortable': false
                    },
                    {
                        targets: [1],
                        render: function (a, b, c) {
                            return '<span class="fa fa-edit open-modal"  data-toggle="modal" data-id="' + c[1]._id + '"></span>';


                        }
                    },
                    {
                        targets: [2],
                        render: function (a, b, c) {
                            if (a)
                                return c[1].sitename + ' / ' + c[1].zonename + ' / ' + c[1].typeName + ' - ' + c[1].deviceSn;
                            else
                                return '-';
                        }
                    },
                    {
                        targets: [3],
                        render: function (a, b, c) {
                            if (c[2] === "CLEARED") {

                                return "Resolved";
                            } else
                                return "Raised";
                        },
                        "createdCell": function (td, cellData, rowData, row, col) {
                            if (cellData == "NOT_CLEARED") {
                                if (row % 2 == 0) {
                                    $(td).css('background-color', '#d3edf3');
                                } else {
                                    $(td).css('background-color', '#bedceb');
                                }
                            }
                        }
                    },
                    {
                        targets: [4],
                        render: function (a, b, c) {
                            return moment(c[3]).format('DD MMM YYYY HH:mm:ss');
                        }
                    },
                    {
                        targets: [5],
                        render: function (a, b, c) {
                            if (c[4])
                                return moment(c[4]).format('DD MMM YYYY HH:mm:ss');
                            else
                                return '-';
                        }
                    },
                    {

                        targets: [6],
                        render: function (a, b, c) {
                            return c[5];
                        },
                        'bSortable': false
                    },
                    {
                        targets: [7],
                        render: function (a, b, c) {

                            if (a['acknowledged']) {
                                if (a['acknowledgedBy']['ts'])
                                    return moment(a['acknowledgedBy']['ts']).format('DD MMM YYYY HH:mm:ss');
                                else
                                    return "<button class='btn btn-sm btn-info js-ack' data-alarmId=" + a['_id'] + "> Acknowledge </button>";

                            } else {
                                return "<button class='btn btn-sm btn-info js-ack' data-alarmId=" + a['_id'] + "> Acknowledge </button>";

                            }
                        }
                    },
                    {
                        targets: [8],
                        render: function (a, b, c) {
                            if (c[1]['acknowledged']) {
                                return "<span>" + c[1]['acknowledgedBy']['fullname'][0].toUpperCase() + c[1]['acknowledgedBy']['fullname'].slice(1) + "</span>";
                            } else {
                                return "-";
                            }
                        }
                    }

                ];
                _.filter(scope.treedata[0]['nodes'], function (data) {
                    sitenames[data.id] = data.text;
                });
                _.filter(scope.treedata[0]['nodes'], function (data) {
                    _.filter(data['nodes'], function (data) {
                        zonenames[data.id] = data.text;
                    })
                })

                scope.options = {
                    "columnDefs": columnDefs,

                    "bScrollCollapse": true,
                    "fnDrawCallback": function () {
                        //Code added by Sneha to show modal to give provision to user to comment on Alarms
                        $('.open-modal').on('click', function (e) {
                            //                            console.log("this...............",$(this).data);
                            //                            console.log("this...............",$(this).data("id"));
                            //                            console.log('datas' ,(collections));
                            var filteredData = _.filter(collections, function (data) {
                                return data[0] == $(e.currentTarget).data('id');
                            })
                            scope.singleAlarmDetails = filteredData[0][1];
                            scope.formInfo.commentAlarmId = scope.singleAlarmDetails._id;
                            scope.$apply();
                            $('#myModal').modal({
                                show: true
                            });
                            $('.theme-comment-history').animate({
                                scrollTop: 500
                            }, 200);

                        });

                        $('#DataTables_Table_Alarms > tbody').on('click', '.js-check', function () {

                            var alarmId = $(this).attr('data-alarmId');
                            if ($(this).is(':checked')) {

                                var isAlreadySelected = _.find(alarmIds, function (id) {
                                    return id === alarmId;
                                });
                                if (!isAlreadySelected) {
                                    alarmIds.push(alarmId);
                                    var $tr = $(this).parents('tr').addClass('selected');
                                    $tr.alarmId = alarmId;
                                    arrayTrs.push($tr);
                                }

                            } else {
                                alarmIds = _.reject(alarmIds, function (id) {
                                    return id === alarmId;
                                });

                                arrayTrs = _.reject(arrayTrs, function (tr) {
                                    if (tr.alarmId === alarmId) {
                                        tr.removeClass('selected');
                                        return true;
                                    }
                                    return false;
                                })
                            }


                            $('.js-ackall').removeClass('disabled');
                            scope.el = null;


                        });

                        $('#DataTables_Table_Alarms > tbody').on('click', '.js-ack', function () {

                            //var alarmId = $(this).data('alarmId');
                            var alarmId = $(this).attr('data-alarmId');
                            scope.el = $(this);
                            scope.acknowledgeAlarms([alarmId]);
                            $(this).parent().next().html("<span>" + username + "</span>");
                            $(this).parent().html(moment().format('DD MMM YYYY HH:mm:ss'));

                        });
                        $('.js-mater-check').on('click', function () {

                            if (this.checked) {
                                $('.js-ackall').removeClass('disabled');
                                $('.js-check').prop("checked", true);
                                alarmIds.splice(0, alarmIds.length);
                                $('.js-check').each(function (i, obj) {
                                    alarmIds.push($(this).attr('data-alarmid'));
                                })
                                $('#DataTables_Table_Alarms tbody tr').addClass('selected');


                            } else {
                                $('.js-ackall').addClass('disabled');
                                $('.js-check').prop("checked", false);
                                $('#DataTables_Table_Alarms tbody tr').removeClass('selected');
                            }

                        });
                        $(".js-ackall").on('click', function () {
                            scope.acknowledgeAlarms(alarmIds);
                            $('#DataTables_Table_Alarms tbody .selected td:nth-child(8)').each(function (i, obj) {
                                $(this).html(moment().format('DD MMM YYYY HH:mm:ss'));
                            });
                            $('#DataTables_Table_Alarms tbody .selected td:nth-child(9)').each(function (i, obj) {
                                $(this).html("<span>" + username + "</span>");
                            });
                            $(this).addClass('disabled');
                            $('.js-mater-check').prop("checked", false);
                            $('#DataTables_Table_Alarms tbody tr').removeClass('selected');
                            $('.js-check').prop("checked", false);

                        });
                    },
                    /*added by iqbal*/
                    "processing": true,
                    "serverSide": true,

                    "ajax": $.fn.dataTable.pipeline({
                            url: UrlRepository.alarms.get,
                            data: paginationConfig,
                            pages: 10, // number of pages to cache
                            method: 'POST', // Ajax HTTP method
                            pipelineFormatJson: function (json) {
                                var convertedJson = {};
                                var data = new Array();
                                convertedJson.recordsTotal = json.data.count;
                                convertedJson.recordsFiltered = json.data.count;
                                angular.forEach(json.data.list, function (value, key) {
                                    value.sitename = sitenames[value.site];
                                    value.zonename = zonenames[value.zone];
                                    data.push(new Array(value._id, value, value.clearedStatus, value.ts, value.cleared_ts,
                                        value.alarmDescription, value, value));
                                });
                                convertedJson.data = data;
                                collections = _.clone(data);
                                return convertedJson;
                            }
                        })
                        /*added by iqbal*/
                };

                scope.updateAcknowledge = function (res) {
                    if (scope.el) {
                        scope.el.html("Acknowledged");
                    } else {

                    }
                };

                scope.showError = function () {

                };
                $timeout(function () {
                    scope.$watch('treedata', function (treedata) {
                        if (treedata.length > 0) {
                            $('#treeview1').treeview({
                                showBorder: false,
                                onhoverColor: '#D4D5E2',
                                data: treedata,
                                onNodeSelected: function (event, node) {
                                    $('#treeviewToggle a').html(node.text + '<span class="fa fa-caret-up"></span>');
                                    //$('#treeviewToggle a').html(node.text);
                                    delete paginationConfig["date"];
                                    delete paginationConfig["sort"];

                                    $('#DataTables_Table_Alarms').dataTable().fnDestroy();
                                    if (node.name == "allsites") {
                                        delete paginationConfig["zones"];
                                        delete paginationConfig["sites"];
                                        delete paginationConfig["deviceIds"];
                                        delete paginationConfig["typeName"];
                                    } else {
                                        delete paginationConfig["zones"];
                                        delete paginationConfig["sites"];
                                        delete paginationConfig["deviceIds"];
                                        delete paginationConfig["typeName"];
                                        paginationConfig[node.name] = node.id;
                                    }

                                    scope.options.ajax = $.fn.dataTable.pipeline({
                                        url: UrlRepository.alarms.get,
                                        data: paginationConfig,
                                        pages: 10, // number of pages to cache
                                        method: 'POST', // Ajax HTTP method
                                        pipelineFormatJson: function (json) {
                                            var convertedJson = {};
                                            var data = new Array();
                                            //convertedJson.draw=1;
                                            convertedJson.recordsTotal = json.data.count;
                                            convertedJson.recordsFiltered = json.data.count;
                                            angular.forEach(json.data.list, function (value, key) {
                                                value.sitename = sitenames[value.site];
                                                value.zonename = zonenames[value.zone];
                                                data.push(new Array(value._id, value, value.clearedStatus, value.ts, value.cleared_ts,
                                                    value.alarmDescription, value, value));
                                            });
                                            convertedJson.data = data;
                                            return convertedJson;
                                        }
                                    })

                                    opts = _.extend({}, opts, scope.options);

                                    oTable = $('#DataTables_Table_Alarms').dataTable(opts);
                                    $('#DataTables_Table_Alarms_filter').css("display", "none");


                                }
                            });
                        }
                    });
                });


                $("#treeviewToggle").click(function () {
                    $("#treeview1").toggle();
                });

                // $timeout(function () {
                opts = _.extend({}, opts, scope.options);
                oTable = $('#DataTables_Table_Alarms').dataTable(opts);
                TableApi = oTable.DataTable();
                $('#myfilter').keyup(function () {
                    oTable.fnFilter($(this).val());

                })
                $('#alamtable-maximise').click(function () {
                    $('#DataTables_Table_Alarms').css('width', '100%');
                })


                $('#DataTables_Table_Alarms_filter').css("display", "none");


                $('.theme-filterdd').daterangepicker({
                    timePicker: true,
                    ranges: {
                        'Today': [moment().startOf('day'), moment()],
                        'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                        'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                        'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment()]
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

                    $('#DataTables_Table_Alarms').dataTable().fnDestroy();
                    paginationConfig.sort = {}
                    paginationConfig.sort.ts = 1;
                    paginationConfig.date = {};
                    paginationConfig.date.from = moment(start).toString();
                    paginationConfig.date.to = moment(end).toString();
                    // console.log(angular.toJson(paginationConfig));
                    scope.options.ajax = $.fn.dataTable.pipeline({
                        url: UrlRepository.alarms.get,
                        data: paginationConfig,
                        pages: 10, // number of pages to cache
                        method: 'POST', // Ajax HTTP method
                        pipelineFormatJson: function (json) {
                            var convertedJson = {};
                            var data = new Array();
                            //convertedJson.draw=1;
                            convertedJson.recordsTotal = json.data.count;
                            convertedJson.recordsFiltered = json.data.count;
                            angular.forEach(json.data.list, function (value, key) {
                                value.sitename = sitenames[value.site];
                                value.zonename = zonenames[value.zone];
                                data.push(new Array(value._id, value, value.clearedStatus, value.ts, value.cleared_ts,value.alarmDescription, value, value));
                            });
                            convertedJson.data = data;
                            return convertedJson;
                        }
                    })

                    opts = _.extend({}, opts, scope.options);
                    oTable = $('#DataTables_Table_Alarms').dataTable(opts);
                    $('#DataTables_Table_Alarms_filter').css("display", "none");
                });

            }
        }
    }]);
    return alarmsDirectives;

});