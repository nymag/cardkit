'use strict';

function smarten(text) {
  return text
    .replace(/(\W|^)"(\S)/g, '$1\u201c$2') // beginning "
    .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2') // ending "
    .replace(/([^0-9])"/g,'$1\u201d') // remaining " at end of word
    .replace(/(\W|^)'(\S)/g, '$1\u2018$2') // beginning '
    .replace(/([a-z])'([a-z])/ig, '$1\u2019$2') // conjunction's possession
    .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/ig, '$1\u2019$3') // ending '
    .replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig, '\u2019$2$3') // abbrev. years like '93
    .replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig, '$1\u2019') // backwards apostrophe
    .replace(/'''/g, '\u2034') // triple prime
    .replace(/("|'')/g, '\u2033') // double prime
    .replace(/'/g, '\u2032'); // prime
}

/**
 * @ngdoc directive
 * @name cardkitApp.directive:textEditor
 * @description
 * # textEditor
 */
angular.module('cardkitApp')
  .directive('textEditor', function () {
    return {
      template: '<div><label>Text (click away for smart quotes)</label><textarea ng-model="element.text" class="form-control"></textarea></div>',
      restrict: 'E',
      replace: true,
  	  scope: {
  	    element: '='
  	  },
      link: function (scope, el) {
        var textArea = el[0].querySelector('textarea');

        textArea.addEventListener('blur', function () {
          scope.element.text = smarten(scope.element.text);
          scope.$apply();
        });
      }
    };
  });
