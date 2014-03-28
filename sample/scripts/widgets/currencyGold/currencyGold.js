/*
 * The MIT License
 * 
 * Copyright (c) 2013, Sebastian Sdorra
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

angular.module('sample.widgets.currencyGold', ['adf.provider', 'googlechart'])
  .value('currencyGoldServiceUrl', 'http://www.kimonolabs.com/api/a41900f6?apikey=46146a02f30c2b81656d492b80f3c738')
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('currencyGold', {
        title: 'Currency Gold Rates',
        description: 'Displays currency converstion rates from AED and gold rates in AED',
        templateUrl: 'scripts/widgets/currencyGold/currencyGold.html',
        controller: 'currencyGoldCtrl',
        resolve: {
          results: function(currencyGoldService, config){
            console.log('resolve results', currencyGoldService);
            config.url = 'a';
            if (config.url){
              return currencyGoldService.get(config.url);
            }
          }
        },
        edit: {
          templateUrl: 'scripts/widgets/news/edit.html'
        }
      });
      console.log('iin config');
  })
  .service('currencyGoldService', function($q, $http, currencyGoldServiceUrl){
    return {
      get: function(url){
        console.log('getting url:' , url);
        console.log('currencyGoldServiceUrl', currencyGoldServiceUrl);

        var deferred = $q.defer();

        $http.jsonp(currencyGoldServiceUrl + '&callback=JSON_CALLBACK')
          .success(function(data){
            console.log('result data:', data);
            if (data && data.results){
              angular.forEach(data.results.aedConversion, function(currencyConverted, key){
                currencyConverted.rate = (currencyConverted.rateEvening) ? currencyConverted.rateEvening : currencyConverted.rateMorning; 
              });
              deferred.resolve(data.results);
            } else {
              deferred.reject();
            }
          })
          .error(function(){
            deferred.reject();
          });
        return deferred.promise;
      }
    };
  })
  .controller('currencyGoldCtrl', function($scope, results){
    console.log('currencyGoldCtrl', results);
    $scope.results = results;
    var yesterdayRate = results.aedConversion[4];
    console.log('yr', yesterdayRate);
    var chart1 = {};
    chart1.type = "Gauge";
    chart1.cssStyle = "height:200px; width:200px;";
    chart1.data = [
          ['Label', 'Value'],
          ['Average', 27],
          ['Today', results.aedConversion[4].rate],
          ['Yesterday', results.aedConversion[4].rateYesterday],
        ];

    chart1.options = {
          width: 600, height: 200,
          redFrom: 30, redTo: 35,
          yellowFrom:25, yellowTo: 30,
          minorTicks: 0.25,
          max: 35,
          min: 20
        };

    chart1.formatters = {};
      console.log('chart1', chart1);
     $scope.chartNpr = chart1;
  });