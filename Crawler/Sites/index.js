var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var Promise = require('bluebird');
var Index = require('../index');
var Watson = require('../watson');

var sites = [
  'www.rollingstone.com/music',
  'www.mtv.com/news/music/',
  'www.npr.org/sections/music-news/',
  'www.billboard.com/news',
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
          // var captured = captureDomNodesRecursion(url, wordsFound, $, null, SEARCH_WORD);
          resolve(captured);
        } else {
          resolve([]);
        }
      });
    })
  }))
  .then((result) => {
    console.log('-------result-------\n', result);
    // return result;
    return Watson.toneAnalysis(result);
  })
  .then((testresult) => {
    console.log('-------testresult-------\n', testresult);    
    return testresult;
  })
  .catch((error) => {
    return error;
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

//Note: This Works - DO NOT DELETE
function captureDomNodes(url, wordsFound, $, isChild, words) {
  var body = $('html > body').children().find('a,h1,h2,h3,h4,h5,h6');
  body.each(function(i, element) {
    var element = $(this).text().trim().toLowerCase();
    wordsFound.forEach(function(word) {
      if(element.includes(word)) {
        words[word].push(element);
      }
    });
  });
  return words; 
}

// function captureDomNodesRecursion(url, wordsFound, $, isChild, words) {
//   var body = $('html > body')[0];
//   console.log('----------BODY---------\n', body);
//   var recursive = function(wordsFound, body, isChild) {
//     for(var i=0; i<body.children.length; i++) {
//       var childNode = body.children[i];

//       //task
//       // wordsFound.forEach(function(word) {
//       //   if(childNode.includes(word)) {
//       //     words[word].push(childNode);
//       //   }
//       // });
//       console.log('childnode: ', childNode);
//       if(childNode.children.length > 0){
//         recursive(wordsFound, childNode, true);
//       }
//     }
//   }
//   recursive(wordsFound, body);
//   return words;
// }

// function collectInternalLinks($) {
//     var relativeLinks = $("a[href^='/']");
//     console.log("Found " + relativeLinks.length + " relative links on page");
//     relativeLinks.each(function() {
//         pagesToVisit.push(baseUrl + $(this).attr('href'));
//     });
// }
