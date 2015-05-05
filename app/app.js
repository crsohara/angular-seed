'use strict';

// Declare app level module which depends on views, and components
var exchangeApp = angular.module('exchangeApp', [
    'ngRoute',
    'exchangeController',
]);

var exchangeController = angular.module('exchangeController', []);


exchangeController.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'partials/view1.html',
      });
}]);

exchangeController.constant('FixerServiceUrl',{
        url: "http://api.fixer.io/latest?",
        controller: 'exchangeController'
    });

exchangeController.controller('exchangeController', ['$scope', 'fixerServiceBase', 'fixerService', 'FixerServiceUrl',
    function($scope, fixerServiceBase, fixerService, FixerServiceUrl){

        fixerServiceBase.getCurrencies()
            .then(function(data) {
                var keys = [];

                keys.push(data.base);

                angular.forEach(data.rates, function(value, key) {
                    keys.push(key);
                });

                $scope.currencies = keys;
                $scope.baseCurr = 'EUR';
                $scope.convCurr = 'USD';
            });

        $scope.go = function() {
            fixerService.getConversion($scope.baseCurr, $scope.convCurr)
                    .then(function(data) {
                        $scope.fromToRate = data.rates[$scope.convCurr];
                    });

                fixerService.getConversion($scope.convCurr, $scope.baseCurr)
                    .then(function(data) {
                        // $scope.currencies = data.rates;
                        $scope.toFromRate = data.rates[$scope.baseCurr];
                    });
        };
    }]);

exchangeController.factory("fixerServiceBase", ['$http', 'FixerServiceUrl', 
    function($http, FixerServiceUrl) {
        var getCurrencies = function(){
            return $http.get(FixerServiceUrl.url)
                .then(function(response){
                    return response.data;
                });
            };
        return {
            getCurrencies: getCurrencies
        };

    }]);

exchangeController.factory("fixerService", ['$http', 'FixerServiceUrl', 
    function($http, FixerServiceUrl) {

        var getConversion = function(BaseCurrency, ConversionCurrency){
            return $http.get(FixerServiceUrl.url+"base="+BaseCurrency+"&symbols="+ConversionCurrency)
                .then(function(response){
                        return response.data;
                });
            };

        // Exposing functions
        return {
            getConversion: getConversion,
        };
    }]);

