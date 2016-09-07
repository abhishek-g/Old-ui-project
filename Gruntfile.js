/**
 * Created by abhishekgoray on 5/21/15.
 */


module.exports = function (grunt) {

    grunt.initConfig({
        ngtemplates: {
            SolarPulse: {
                cwd: "public",
                src: ["modules/**/html/view/**.html",'modules/**/html/partials/**/**.html','modules/**/html/partial/**.html'],
                dest: "public/modules/app.templates.js",
                options: {
                    prefix: '/',
                    htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true },
                    bootstrap : function(module,script){
                        return "define(function(require){ " +
                            "var angular = require('angular'); " +
                            "angular.module('SolarPulse.Tpls',[])" +
                            ".run(['$templateCache', function($templateCache) {" +
                            script  + "}]); });"
                    }
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                keepSpecialComments: 0,
                relativeTo:'/theme/css'
            },
            target: {
                files: [{
                    src: ['public/theme/css/theme-default.css'],
                    dest:"public/theme/css/theme-default.min.css"
                }]
            }
        }
    });


    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['ngtemplates','cssmin']);

};