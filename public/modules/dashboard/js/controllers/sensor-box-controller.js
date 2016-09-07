/**
 * Created by mepc1299 on 11/2/15.
 */
/**
 * Created by abhishekgoray on 12/19/14.
 */

define(['angular'], function (angular) {

    var SensorBoxControllers = angular.module('SolarPulse.SensorBox.Controllers', []);
    var range = {
        'Today': 'live',
        'live':'live',
        'hours':'hours',
        'days':'days',
        'months':'months',
        'Yesterday': 'hours',
        'Last 7 Days': 'days',
        'Last 6 Months': 'months',
        'Custom Range': 'days'
    };

    SensorBoxControllers.controller("SensorBoxController", ['$scope','$rootScope','SitesHierarchy','Weatherstation','$interval','WidgetTimeInterval','RequestFormatter',
        function ($scope, $rootScope,SitesHierarchy,Weatherstation,$interval,WidgetTimeInterval,RequestFormatter) {
            var reqpayload={};

            //@TODO clean dis part of code.. make a global object for the same rather that if condition
            $scope.getwindDirection=function(dir){
                var winddir;
                if(dir=='N')
                    winddir=0;
                if(dir=='NNE')
                    winddir=22.5;
                if(dir=='NE')
                    winddir=45;
                if(dir=='ENE')
                    winddir=67.5;
                if(dir=='E')
                    winddir=90;
                if(dir=='ESE')
                    winddir=112.5;
                if(dir=='SE')
                    winddir=135;
                if(dir=='SSE')
                    winddir=157.5;
                if(dir=='S')
                    winddir=180;
                if(dir=='SSW')
                    winddir=202.5;
                if(dir=='SW')
                    winddir=225;
                if(dir=='WSW')
                    winddir=247.5;
                if(dir=='W')
                    winddir=270;
                if(dir=='WNW')
                    winddir=292.5;
                if(dir=='NW')
                    winddir=315;
                if(dir=='NNW')
                    winddir=337.5;
                return winddir;
            }

            $scope.getweatherStatus=function(dateobj){
                var toSendDay = {
                    "fDate": moment(dateobj).startOf('day'),
                    "tDate": moment(dateobj).endOf('day')
                };
                reqpayload= RequestFormatter.getOptionsForWspeed(toSendDay,'days', $scope.sites, $scope.sensorbox.label);
//                console.log('wsssda' + angular.toJson(reqpayload));
                Weatherstation.status(reqpayload,'WsStatusDailyPoa').then(function (res) {
                    console.log('poa req' + angular.toJson(reqpayload));
                    console.log('poa res' + angular.toJson(res));
                    if(res.length != 0)
                        $scope.dailypoa=parseInt(res[0].totalPoa);
                    else
                        $scope.dailypoa='-';
                }, function (err) {
                    console.log(err);
                });
                Weatherstation.status(reqpayload,'wsstatus').then(function (res) {
                    $scope.dailyghi=res.AmbTmpC;
                    $scope.rainfall=0;
                    if(res.humidity)
                    $scope.humidity=res.Humidity;
                    else
                    $scope.humidity = '-';
                    $scope.windspeed=res.WindSpeed;
                    $scope.windirection=res.WindDirection;
                    $scope.winddir=$scope.getwindDirection($scope.windirection);
                    //$scope.directionArray=['NNE','NE','ENE','E','ESE','SE','N','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
                    $scope.directionArray=[];
                    if($scope.windirection.length==1){
                        $scope.directionArray.push($scope.windirection + ' 100 %');
                    }
                    else if($scope.windirection.length==2){
                            $scope.directionArray.push($scope.windirection[0] + ' 50 %');
                            $scope.directionArray.push($scope.windirection[1] + ' 50 %');
                    }
                    else if($scope.windirection.length==3){
                        $scope.directionArray.push($scope.windirection[0] + ' 50 %');
                        $scope.directionArray.push($scope.windirection[1] +' '+ $scope.windirection[2] + ' 50 %');
                    }
                }, function (err) {
                    console.log(err);
                });
            };



            $scope.gettempdate=function(index){
                $scope.currenttemp=$scope.AmbTmpClist[index];
                $scope.currentDate=$scope.datelist[index];
                if(index === ($scope.datelist.length-1))
                    $scope.iftoday=true;
                else
                    $scope.iftoday=false;
            };
            $scope.getTempdetails=function(){
                var toSendDay={
                    "fDate": moment().startOf('month'),
                    "tDate": moment().endOf('day')
                };
                var tempreqpayload= RequestFormatter.getOptionsForWspeed(toSendDay,'days', $scope.sites, $scope.sensorbox.label);
                Weatherstation.tempdetails(tempreqpayload,'tmpdetails').then(function (res) {
                    $scope.datelist=[];
                    $scope.AmbTmpClist=[];
                    for(i=0;i<res.ambTemp[0].values.length;i++){
//                        console.log(res.ambTemp[0].values[i].ts);
                        $scope.datelist.push(res.ambTemp[0].values[i].ts);
                        $scope.AmbTmpClist.push(res.ambTemp[0].values[i].AmbTmpC);
                        if(i==(res.ambTemp[0].values.length-1)) {
                            $scope.currenttemp = res.ambTemp[0].values[i].AmbTmpC;
                            $scope.currentDate=  res.ambTemp[0].values[i].ts;
                        }
                    }
                }, function (err) {
                    console.log(err);
                });
            }
            $interval(function() {
                $rootScope.$broadcast("dateChanged");
            },WidgetTimeInterval.timeInterval);

            $scope.$on($scope.dashboardView + 'viewUpdated', function (context, date) {

                $scope.sites = SitesHierarchy.getHierarchyObject($scope.sitesList[0].children, $scope.sensorbox.label,['Sensor Box','sensorbox-overview','WSTATION']);

               /* $scope.getweatherStatus(date);
                $scope.iftoday=true;
                $scope.getTempdetails();*/
                $scope.isWindDirectionPresent= _.find($scope.sitesList[0]['children'],function(Site){
                    return (Site['id'] === $scope.sites && Site['displayName'].toLowerCase().indexOf('mang')>=0);
                });
                reqpayload.sites=$scope.sites;
                reqpayload.deviceSn=$scope.sensorbox.label;
                $scope.getweatherStatus();
                $scope.getTempdetails();
            });
        }]);



    SensorBoxControllers.controller("SurfaceVsAmbientController", ['$scope', 'InvertersStatus', 'InvResDataFormatter', 'RequestFormatter','Weatherstation',
        '$rootScope', function ($scope, InvertersStatus, InvResDataFormatter, RequestFormatter,Weatherstation,$rootScope) {
            $scope.stvsambt = [];
            $scope.siteName = $scope.selectedNodeName;
            $scope.viewMode = "live";
            var reqPayLoad={};
            range['Today'] = "live";
            range['live']="live";
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if(groupby=='live')
                    range[groupby]='live';
                $scope.viewMode = range[groupby];
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDay['fDate']=startdate;
                toSendDay['tDate']=enddate;
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {

                InvertersStatus.getAmbModTemperarture(reqPayLoad).then(function (res) {
                        if (res.modTemp.length > 0) {
                            $scope.stvsambt = Weatherstation.formatAmbModTemp(res.modTemp);
                        }
                }, function (err) {

                        });
                };

            $scope.reloadWidget = function () {
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context,date) {
                $scope.siteName = $scope.selectedNodeName;
                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();
            });

        }])

    SensorBoxControllers.controller("winddriection", ['$scope', 'DataAq', 'RequestFormatter', 'ChartResponseService',
        '$rootScope','$timeout', function ($scope, DataAq, RequestFormatter, ChartResponseService, $rootScope) {
            $scope.reloadWidget=function(){

                $scope.winddir=$scope.getwindDirection($scope.windirection);
            }

        }])



    SensorBoxControllers.controller("livewindspeed", ['$scope', 'Weatherstation', 'RequestFormatter', 'ChartResponseService',
        '$rootScope', function ($scope, Weatherstation, RequestFormatter, ChartResponseService, $rootScope) {

            $scope.windspeed = {};
            $scope.siteName = $scope.selectedNodeName;
            $scope.viewMode = "live";
            var reqPayLoad={};
            range['Today'] = "live";
            range['live']='live';
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if(groupby=='live')
                    range[groupby]='live';
                $scope.viewMode = range[groupby];
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {
                $scope.viewMode = range[viewMode];
                toSendDay['fDate']=startdate;
                toSendDay['tDate']=enddate;
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {
                var newdata={};
                var ts=[];
                var data=[];
                var DirectionData=[];
                Weatherstation.WindSpeedVsDirection(reqPayLoad,"wsspeed").then(function(res){
                    angular.forEach(res.windTrend[0].values, function (value,key) {
                        ts.push(moment(value.ts).unix() * 1000);
                        data.push([moment(value.ts).unix() * 1000,value.windSpeed]);
                        DirectionData.push([moment(value.ts).unix() * 1000,value.windDirection]);
                    });
                    //newdata.ts=ts;
                    newdata.data=data;
                    newdata.DirectionData=DirectionData;
                    $scope.windspeed=newdata;
                }, function (err) {

                });
            };

            $scope.reloadWidget = function () {
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();

                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context,date) {
                $scope.siteName = $scope.selectedNodeName;
                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();
            });
        }])


    SensorBoxControllers.controller("humidity", ['$scope', 'Weatherstation', 'RequestFormatter', 'ChartResponseService',
        '$rootScope', function ($scope, Weatherstation, RequestFormatter, ChartResponseService, $rootScope) {
            $scope.windpoadata = {};
            $scope.siteName = $scope.selectedNodeName;
            $scope.viewMode = "hours";
            var reqPayLoad={};
            range['Today'] = "hours";
            range['live']="hours";
            var toSendDay = {
                "fDate": moment().startOf('day'),
                "tDate": moment().endOf('day')
            };

            $scope.groupByChange = function (groupby) {
                if(groupby=='live')
                    range[groupby]='hours';
                $scope.viewMode = range[groupby];
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.setViewMode = function (viewMode, startdate, enddate) {

                $scope.viewMode = range[viewMode];
                toSendDay['fDate']=startdate;
                toSendDay['tDate']=enddate;
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();
                $scope.getData(reqPayLoad);
            };

            $scope.getData = function (reqPayLoad) {

                var newdata={};
                var ts=[];
                var data=[];
                Weatherstation.windpoa(reqPayLoad,"windpoa").then(function(res){

//                    $scope.humidity={
//                    data:[[1423614600000,0],[1423615500000,0],[1423616400000,0],[1423617300000,0],[1423618200000,3.333333],[1423619100000,18.857143],[1423620000000,32.714286],[1423620900000,46.875],[1423621800000,100.571429],[1423622700000,116],[1423623600000,120.333333],[1423624500000,142.875],[1423625400000,150.142857],[1423626300000,158.285714],[1423627200000,153.571429],[1423628100000,146.857143],[1423629000000,180.857143],[1423629900000,196.571429],[1423631700000,218],[1423632600000,325.625],[1423633500000,420],[1423634400000,412],[1423635300000,450.285714],[1423636200000,755.125],[1423637100000,851.857143],[1423638000000,859.25],[1423638900000,865.714286],[1423639800000,889.428571],[1423640700000,891.5],[1423641600000,862.428571],[1423642500000,844.714286],[1423643400000,816.142857],[1423644300000,803.571429],[1423645200000,743.375],[1423646100000,719.857143],[1423647000000,665.142857],[1423647900000,612.571429],[1423648800000,572.857143],[1423649700000,492.428571],[1423650600000,429.285714],[1423651500000,363.875],[1423652400000,302.428571]]
//                    }
                    angular.forEach(res.poa[0].values,function(value,key){
                        ts.push(moment(value.ts).unix() * 1000);
                        data.push(value.POA);
                    })
                    newdata.ts=ts;
                    newdata.data=data;
                    $scope.windpoadata=newdata;

                },function(err){

                });
            };

            $scope.reloadWidget = function () {
                reqPayLoad= RequestFormatter.getOptionsForWspeed(toSendDay, $scope.viewMode, $scope.sites, $scope.sensorbox.label);
                $scope.showRefresh();

                $scope.getData(reqPayLoad);
            };

            $scope.$on($scope.dashboardView + "viewUpdated", function (context,date) {
                $scope.siteName = $scope.selectedNodeName;
                toSendDay = {
                    "fDate": moment(date).startOf('day'),
                    "tDate": moment(date).endOf('day')
                };
                $scope.reloadWidget();
            });


//            $scope.humidity={
//                data:[[1423614600000,0],[1423615500000,0],[1423616400000,0],[1423617300000,0],[1423618200000,3.333333],[1423619100000,18.857143],[1423620000000,32.714286],[1423620900000,46.875],[1423621800000,100.571429],[1423622700000,116],[1423623600000,120.333333],[1423624500000,142.875],[1423625400000,150.142857],[1423626300000,158.285714],[1423627200000,153.571429],[1423628100000,146.857143],[1423629000000,180.857143],[1423629900000,196.571429],[1423631700000,218],[1423632600000,325.625],[1423633500000,420],[1423634400000,412],[1423635300000,450.285714],[1423636200000,755.125],[1423637100000,851.857143],[1423638000000,859.25],[1423638900000,865.714286],[1423639800000,889.428571],[1423640700000,891.5],[1423641600000,862.428571],[1423642500000,844.714286],[1423643400000,816.142857],[1423644300000,803.571429],[1423645200000,743.375],[1423646100000,719.857143],[1423647000000,665.142857],[1423647900000,612.571429],[1423648800000,572.857143],[1423649700000,492.428571],[1423650600000,429.285714],[1423651500000,363.875],[1423652400000,302.428571]]
//            }
        }])

    return SensorBoxControllers;

});