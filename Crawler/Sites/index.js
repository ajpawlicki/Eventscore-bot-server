var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var Promise = require('bluebird');
var Index = require('../index');
var Watson = require('../watson');

var sites = [
  'www.reddit.com',
  'www.buzzfeed.com',
  // 'news.ycombinator.com'
];

var url, baseUrl;

exports.initiateCrawl = function() {
  return Promise.all(sites.map((site) => {
    return new Promise((resolve, reject) => {
      
      var SEARCH_WORD = {};
      Index.keywords.forEach( (keyword) => {
        SEARCH_WORD[keyword] = [];
      });

      site = 'https://' + site;
      url = new URL(site);
      baseUrl = url.protocol + '//' + url.hostname;
      SEARCH_WORD.hostname = url.hostname;
      request(url.origin, function(error, response, body) {
        if(response.statusCode !== 200) {
          reject(error);
        }
        var $ = cheerio.load(body, {ignoreWhitespace: true});
        var htmlBody = $('html > body');
        var wordsFound = searchForWord(htmlBody, SEARCH_WORD);
        if(wordsFound.length > 0) {
          var captured = captureDomNodes(url, wordsFound, $, null, SEARCH_WORD);
          resolve(captured);
        } else {
          resolve([]);
        }
      });
    })
  }))
  .then((result) => {
    return Watson.toneAnalysis(result);
  })
  .then((testresult) => {
    return testresult;
  });
}

function searchForWord(chunk, words) {
  var lowerChunk = chunk.text().toLowerCase();
  var foundKeywords = [];
  for(var property in words) {
    var lowerProperty = property.toLowerCase();
    if(lowerChunk.includes(lowerProperty)) {
      foundKeywords.push(lowerProperty);
    }
  }
  return foundKeywords;
}

function captureDomNodes(url, wordsFound, $, isChild, words) {
  var aBody = $('html > body').children().find('a');
  aBody.each(function(i, element) {
    var aElement = $(this).text().trim().toLowerCase();
    wordsFound.forEach(function(word) {
      if(aElement.includes(word)) {
        words[word].push(aElement);
      }
    });
  });
  return words; 
}

// function collectInternalLinks($) {
//     var relativeLinks = $("a[href^='/']");
//     console.log("Found " + relativeLinks.length + " relative links on page");
//     relativeLinks.each(function() {
//         pagesToVisit.push(baseUrl + $(this).attr('href'));
//     });
// }
