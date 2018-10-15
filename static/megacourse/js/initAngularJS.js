/**
 * Created by leo on 24/01/18.
 */

var app = angular.module("homeschool", ['ngSanitize', 'chart.js']);
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});