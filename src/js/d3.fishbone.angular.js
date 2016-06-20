// Define module using Universal Module Definition pattern
// https://github.com/umdjs/umd/blob/master/returnExports.js

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // Support AMD. Register as an anonymous module.
        // EDIT: List all dependencies in AMD style
        define(['angular', 'd3'], factory);
    } else {
        // No AMD. Set module as a global variable
        // EDIT: Pass dependencies to factory function
        factory(root.angular, root.d3);
    }
}(this,
    //EDIT: The dependencies are passed to this function
    function(angular, d3) {
        //---------------------------------------------------
        // BEGIN code for this module
        //---------------------------------------------------

        'use strict';

        return angular.module('fishbone', [])
            .directive('fishbone', function() {
                return {
                    restrict: 'AE',
                    require: 'ngModel',
                    transclude: true,
                    scope: {
                        fishboneConfig: '='
                    },
                    link: function(scope, element, attrs, ngModel) {
                        try {
                            d3
                        } catch (error) {
                            throw new Error('d3.js not loaded.');
                        }
                        var el = element[0];
                        scope.$watch(function() {
                            return ngModel.$modelValue;
                        }, function(newValue) {
                            console.log(newValue);
                            if (!newValue) return;
                            if (Object.keys(newValue).length === 0 && newValue.constructor === Object) return;
                            refresh(newValue);
                        });

                        // create the configurable selection modifier
                        var fishbone = d3.fishbone();
                        var size = (function() {
                            return {
                                width: el.clientWidth,
                                height: el.clientHeight
                            };
                        });
                        var svg = d3.select(el).append("svg");

                        function refresh(data) {

                            // set the data so the reusable chart can find it
                            svg.datum(data)
                                // set up the default arrowhead
                                .call(fishbone.defaultArrow)
                                // call the selection modifier
                                .call(fishbone);

                            fishbone.force()
                                .size([size().width, size().height])
                                .start();
                            svg.attr(size());

                        };

                        // handle resizing the window

                        d3.select(window).on("resize", function() {
                            fishbone.force()
                                .size([size().width, size().height])
                                .start();
                            svg.attr(size())
                        });

                        scope.fishbone = fishbone;
                    }
                };
            });

        //---------------------------------------------------
        // END code for this module
        //---------------------------------------------------
    }));
