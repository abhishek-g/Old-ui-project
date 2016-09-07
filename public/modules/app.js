/**
 * Created by abhishekgoray on 11/26/14.
 */
define(['angular', 'oclazyload', 'angularRouter', 'cookies'], function (angular) {

    var SolarPulse = angular.module('SolarPulse', ['ui.router', 'oc.lazyLoad', 'ngCookies','SolarPulse.Tpls']);

    SolarPulse.config(['$stateProvider', '$locationProvider', '$ocLazyLoadProvider', '$urlRouterProvider', '$httpProvider',
        function ($stateProvider, $locationProvider, $ocLazyLoadProvider, $urlRouterProvider, $httpProvider) {

                $httpProvider.defaults.timeout = 10000;

                $ocLazyLoadProvider.config({
                    loadedModules: ['SolarPulse'],
                    asyncLoader: require
                });

                $stateProvider
                    .state('login', {
                        url: '/',
                        isLoginReq: false,
                        templateUrl: "/modules/login/html/view/login.html",
                        controller: 'LoginController',
                        resolve: {
                            load: function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: "SolarPulse.Login",
                                    files: [
                                    '/modules/login/login.js', '/modules/login/css/login.css',
                                        './theme/js/plugins/icheck/icheck.min.js',
                                    './theme/js/plugins/owl/owl.carousel.min.js',
                                    './theme/js/plugins/bootstrap/bootstrap.min.js'
                                ]
                                });
                            }
                        }
                    })
                    .state('home', {
                        templateUrl: "/modules/home/html/view/home.html",
                        isLoginReq: true,
                        controller: 'HomeController',
                        resolve: {
                            loadHome: ['$ocLazyLoad', '$rootScope', function ($ocLazyLoad, $rootScope) {
                                return $ocLazyLoad.load({
                                    name: "SolarPulse.Home",
                                    files: [
                                    '/modules/home/home.js', '/modules/home/css/home.css','/modules/dashboard/css/responsive.css'
                                    ]
                                });
                            }],
                            testObj: ['$q', '$http', function ($q, $http) {
                                return $http({
                                    url: "/sites/hierarchy",
                                    method: 'GET',
                                    accepts: {
                                        "Content-Type": "application/json",
                                        "dataType": "json"
                                    }
                                });
                            }]
                        }
                    })
                    .state('users', {
                        url: '/users',
                        templateUrl: "/modules/users/html/view/users.html",
                        parent: 'home',
                        isLoginReq: true,
                        controller: 'UsersController',
                        resolve: {
                            load: ['$ocLazyLoad', 'loadHome', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: "SolarPulse.Users",
                                    files: [
                                        '/modules/users/users.js', '/modules/users/css/users.css',
                                        'http://cdn.datatables.net/responsive/1.0.3/css/dataTables.responsive.css',
                                        'http://cdn.datatables.net/responsive/1.0.3/js/dataTables.responsive.js'
                                    ]
                                });
                            }]
                        }
                    })
                    .state('alarms', {
                        url: '/alarms',
                        parent: 'home',
                        isLoginReq: true,
                        templateUrl: "/modules/alarms/html/view/alarms.html",
                        controller: 'AlarmsController',
                        resolve: {
                            load: ['$ocLazyLoad', 'loadHome', function ($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        name: "SolarPulse.Alarms",
                                        files: [
                                    '/modules/alarms/alarms.js', '/modules/alarms/css/alarms.css',
                                    '/libs/tree/css/bootstrap-treeview.css',
                                    '/theme/css/datatables/jquery.dataTables.css',
                                    '/theme/js/actions.js', '/libs/tableExport/table-export.js',
                                    '/libs/tree/css/angular.treeview.css',
                                    'http://cdn.datatables.net/responsive/1.0.3/css/dataTables.responsive.css',
                                    'http://cdn.datatables.net/responsive/1.0.3/js/dataTables.responsive.js'
                                               ]
                                    });
                            }]
                        }
                    })
                    .state('dashboard', {
                        url: '/dashboard',
                        parent: 'home',
                        controller: "DashboardController",
                        isLoginReq: true,
                        views: {
                            '': {
                                templateUrl: "/modules/dashboard/html/view/dashboard.html",
                                controller: 'DashboardController'
                            },
                            'singlesite@dashboard': {
                                templateUrl: "/modules/dashboard/html/view/dashboard-singlesite.html",
                                controller: 'SingleSitesController'
                            },
                            'allzones@dashboard': {
                                templateUrl: "/modules/dashboard/html/view/dashboard-allzones.html",
                                controller: 'AllZonesController'
                            },
                            'singlezone@dashboard': {
                                templateUrl: "/modules/dashboard/html/view/dashboard-singlezone.html",
                                controller: 'SingleZoneController'
                            },
                            'inverteroverview@dashboard': {
                                templateUrl: "/modules/dashboard/html/view/dashboard-inverter-overview.html",
                                controller: 'InvOverviewController'
                            },
                            'singleinverter@dashboard': {
                                templateUrl: "/modules/dashboard/html/view/dashboard-singleinverter.html",
                                controller: 'SingleInverterController'
                            },
                            'singlesensorbox@dashboard': {
                                templateUrl: "/modules/dashboard/html/view/dashboard-singlesensor.html",
                                controller: 'SensorBoxController'
                            },
                            'gmeter@dashboard': {
                                templateUrl: "/modules/dashboard/html/view/dashboard-gmeter.html",
                                controller: 'GmeterController'
                            }

                        },
                        resolve: {
                            load: ['$ocLazyLoad', 'loadHome', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: "SolarPulse.Dashboard",
                                    files: [
                                    '/modules/dashboard/dashboard.js', '/modules/dashboard/css/dashboard.css',
                                    '/modules/dashboard/css/single-site.css', '/theme/css/ion/ion.rangeSlider.css',
                                    '/theme/css/ion/ion.rangeSlider.skinHTML5.css', '/libs/carousel/angular-carousel.css',
                                    '/libs/tree/css/angular.treeview.css', '/libs/ellipsis/css/ellipsis.css',
                                    '/modules/dashboard/css/dashboardallzones.css',
                                    '/modules/dashboard/css/dashboardsinglezone.css',
                                    '/modules/dashboard/css/dashboradsensor.css',
                                    '/modules/dashboard/css/inv-overview.css'                                    
                                ]

                                });
                        }]
                        }
                    });

                $urlRouterProvider.otherwise('/dashboard');

                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });

        }])
        .run(['$rootScope', '$window', '$state', '$cookies', function ($rootScope, $window, $state, $cookies) {

            $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
                if (toState.isLoginReq) {
                    if (!$cookies.Session) {
                        $state.go('index');
                    }
                }
            });

            $rootScope.el = $('body');
        }])
        .factory('MyOwnInterceptor', ['$rootScope', '$q', 'AjaxLoader', function ($rootScope, $q, AjaxLoader) {
            var Counter = function () {
                var count = 0;
                var getCount = function () {
                    return count;
                };
                var appendCount = function () {
                    count++;
                };
                var reduceCount = function () {
                    count--;
                };
                return {
                    getCount: getCount,
                    appendCount: appendCount,
                    reduceCount: reduceCount
                }
            };

            var Count = new Counter();
            var $el = {};
            return {
                'request': function (config) {
                    Count.appendCount();
                    if (Count.getCount() === 1) {
                        $el = $($rootScope.el);
                        AjaxLoader.showRefreshing($el);
                    }
                    return config;
                },
                'response': function (response) {
                    Count.reduceCount();
                    if (!Count.getCount()) {
                        AjaxLoader.removeRefresh($el);
                        console.log("ALL REQUESTS OVER", $el);
                    }
                    return response
                },
                'responseError': function (response) {
                    return $q.reject(response);
                }
            }
        }])
        .factory('AjaxLoader', function () {
            var $el = {};
            return {
                showRefreshing: function ($elem) {
                    $el = $elem;
                    $elem.append('<div class="panel-refresh-layer"><img src="/modules/global/css/img/loaders/default.gif"/></div>');
                    $elem.find(".panel-refresh-layer").width($elem.width()).height($elem.height() - 20);
                    $elem.addClass("panel-refreshing");
                },
                removeRefresh: function ($elem) {
                    if (!$elem) {
                        $elem = $el;
                    }
                    $elem.find(".panel-refresh-layer").remove();
                    $elem.removeClass("panel-refreshing");
                }
            };
        })
        .factory("UserService", ['$window', function ($window) {
            var user = {};
            return {
                setUser: function (User) {
                    user = User;
                    $window.localStorage.setItem('User', JSON.stringify(user));
                },
                getUser: function () {
                    if ($.isEmptyObject(user)) {
                        user = JSON.parse($window.localStorage.getItem('User'));
                    }
                    return user;
                },
                getSite: function (siteId) {
                    if ($.isEmptyObject(user)) {
                        user = JSON.parse($window.localStorage.getItem('User'));
                    }
                    return user['sites_list'][siteId];
                }
            }
        }]);

    return SolarPulse;
});