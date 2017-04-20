exports.keywords = [
'beyonce', 'bruno mars', 'apple'
]

// var request = require('request');
// var cheerio = require('cheerio');
// var URL = require('url-parse');
// var Promise = require('bluebird');
// var Watson = require('./watson');

// var Sites = require('./Sites/index');


// var SEARCH_WORD = {
//   'this': [],
//   'push': [],
// };

// var MAX_PAGES_TO_VISIT = 10;
// var numPagesVisited = 0;
// var pagesVisited = {};
// var pagesToVisit = [];
// var url, baseUrl;

// Promise.each( Sites.sites, (site) => {
//   site = 'https://' + site;
//   url = new URL(site);
//   baseUrl = url.protocol + '//' + url.hostname;
//   pagesToVisit.push(site);
//   crawl();
// });

// function crawl() {
//   if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
//     console.log("Reached max limit of number of pages to visit.");
//     return;
//   }
//   var nextPage = pagesToVisit.pop();
//   if(nextPage === undefined) {
//     Watson.toneAnalysis(SEARCH_WORD);
//     return;
//   }
//   if (nextPage in pagesVisited) {
//     crawl();
//   } else {
//     visitPage(nextPage, crawl);
//   }
// }

// function visitPage(url, callback) {
//   pagesVisited[url] = true;
//   numPagesVisited++;

//   console.log("Visiting page " + url);
//   request(url, function(error, response, body) {
//       if(response.statusCode !== 200) {
//         callback();
//         return;
//       }
//       var $ = cheerio.load(body, {
//         ignoreWhitespace: true
//       });
//       var wordsFound = searchForWord($, SEARCH_WORD);
//       if(wordsFound.length > 0) {
//         var captured = captureDomNodes(url, wordsFound, $);
//         callback();
//       } else {
//         // collectInternalLinks($);
//         callback();
//       }
//   });
// }

// function searchForWord($, words) {
//   var bodyText = $('html > body').text().toLowerCase();
//   var foundKeywords = [];
//   for(var property in words){
//     var lowerProperty = property.toLowerCase();
//     if(bodyText.includes(lowerProperty)){
//       foundKeywords.push(lowerProperty);
//     }
//   }
//   return foundKeywords;
// }

// function captureDomNodes(url, wordsFound, $, isChild) {
//   var aBody = $('html > body').children().find('a');
//   aBody.each(function(i, element) {
//     var aElement = $(this).text().trim().toLowerCase();
//     wordsFound.forEach(function(word) {
//       if(aElement.includes(word)) {
//         var objContainer = {};
//         objContainer.text = aElement;
//         objContainer.source = url;
//         SEARCH_WORD[word].push(objContainer);
//       }
//     });
//   }); 
// }

// function collectInternalLinks($) {
//     var relativeLinks = $("a[href^='/']");
//     console.log("Found " + relativeLinks.length + " relative links on page");
//     relativeLinks.each(function() {
//         pagesToVisit.push(baseUrl + $(this).attr('href'));
//     });
// }