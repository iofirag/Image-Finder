var app = angular.module('app.router', ['app.controllers','ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/imageFinder');
    $stateProvider
        .state('imageFinder', {
            url: '/imageFinder',
            controller: 'imageFinderCtrl',
            templateUrl: '../pages/imageFinder.html'
        })
        .state('history', {
            url: '/history',
            controller: 'historyCtrl',
            templateUrl: '../pages/history.html'
        })
});