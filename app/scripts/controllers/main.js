'use strict';

/**
 * @ngdoc function
 * @name cardkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cardkitApp
 */
angular.module('cardkitApp')
  .controller('MainCtrl', function ($scope, saveSvgAsPng, themeConfig) {

    $scope.config = {
      sizes: [
        {
          name: 'Facebook',
          width: 600,
          height: 314,
        },
        {
          name: 'Twitter',
          width: 512,
          height: 256,
        },
        {
          name: 'Instagram',
          width: 540,
          height: 540
        },
        {
          name: 'Pinterest',
          width: 367,
          height: 551
        }
      ],
      themes: themeConfig,
      output: {
        scale: 2,
        editable: {
          scale: true
        }
      },
      svg: {
        canvas: {
          height: function() {
            return $scope.size.height;
          },
          width: function() {
            return $scope.size.width;
          },
        },
        elements: [
          {
            name: 'Background Colour',
            type: 'rect',
            height: function() {
              return $scope.size.height;
            },
            width: function() {
              return $scope.size.width;
            },
            fill: function() {
              return $scope.theme.background;
            },
            editable: {
              fill: 'picker'
            }
          },
          {
            name: 'Image',
            type: 'image',
            width: 600,
            height: function() {
              return this.width;
            },
            src: '',
            opacity: 1,
            x: '0%',
            y: '0%',
            preserveAspectRatio: 'xMinYMin meet',
            draggable: true,
            defaultFilter: '',
            editable: {
              src: true,
              width: true,
              opacity: true,
              filters: [
                'Sepia',
                'Grayscale',
                'Saturate',
                'Invert',
                'Blur'
              ],
            }
          },
          {
            name: 'Logo',
            type: 'image',
            width: 100,
            height: function() {
              return this.width;
            },
            src: function() {
              return $scope.theme.logoSrc;
            },
            opacity: 1,
            x: 40,
            y: 150,
            preserveAspectRatio: 'xMinYMin meet',
            editable: {
              src: true,
              width: true,
            },
            draggable: true
          },
          {
            name: 'Credit',
            type: 'text',
            text: 'Credit: Insert name here',
            fill: function() {
              return $scope.theme.quote;
            },
            fontSize: 14,
            fontFamily: function() {
              return $scope.theme.creditFont || $scope.theme.headlineFont;
            },
            textAnchor: 'start',
            x: 40,
            y: 150,
            draggable: true,
            editable: {
              text: true,
              fontSize: {
                '14px - Extra Small': 14,
                '16px - Small': 16,
                '22px - Medium': 22,
                '26px - Large': 26,
                '36px - Extra Large': 36
              },
              fill: 'picker',
              textAnchor: true
            },
          },
          {
            name: 'Headline',
            type: 'text',
            text: 'Edit and rearrange this text.',
            fill: function() {
              return $scope.theme.quote;
            },
            fontSize: 26,
            fontFamily: function() {
              return $scope.theme.headlineFont;
            },
            textAnchor: 'start',
            x: 40,
            y: 80,
            draggable: true,
            editable: {
              text: true,
              fill: 'picker',
              textAnchor: true,
              fontSize: {
                '14px - Extra Small': 14,
                '16px - Small': 16,
                '22px - Medium': 22,
                '26px - Large': 26,
                '36px - Extra Large': 36
              },
            },
          },
        ],
      }
    };

    function createConfigCopy() {
      $scope.defaultConfig = angular.copy($scope.config);
      $scope.$broadcast('resetSvg');
    }

    if(typeof $scope.config.themes !== 'undefined') {
      $scope.theme = ($scope.config.themes.length > 1) ? null : $scope.config.themes[0];
    }

    $scope.size = ($scope.config.sizes.length > 1) ? null : $scope.config.sizes[0];

    $scope.$watch('theme', function() {
      $scope.$broadcast('changeTheme');
      createConfigCopy();
    });

    $scope.$watch('size', function() {
      $scope.$broadcast('changeSize');
      createConfigCopy();
    });

    $scope.resetSvg = function() {
      $scope.config.svg = $scope.defaultConfig.svg;
      createConfigCopy();
    };

    // Drop handler.
    $scope.onDrop = function (data, event, key) {
      var dataTransfer = getDataTransfer(event);
      readFile(dataTransfer.files[0], key);
    };

    $scope.fileChanged = function(file) {
      readFile(angular.element(file)[0].files[0], angular.element(file).data('key'));
    };

    // Read the supplied file (from DataTransfer API)
    function readFile(file, key) {
      var reader = new FileReader();

      reader.onload = function() {
        $scope.config.svg.elements[key].src = reader.result;
        $scope.$apply();
      };

      reader.readAsDataURL(file);
    }

    // Get the data transfer
    function getDataTransfer(event) {
      event.stopPropagation();
      event.preventDefault();
      return event.dataTransfer || null;
    }

    $scope.removeImage = function(key) {
      $scope.config.svg.elements[key].src = '';
    };


    $scope.downloadSvg = function() {
      saveSvgAsPng(document.getElementById('snap-svg'), 'image.png', {
        scale: $scope.config.output.scale
      });
    };

    $scope.orderByValue = function (value, name) {
      console.log(value, name);
      return value;
    };
  });
