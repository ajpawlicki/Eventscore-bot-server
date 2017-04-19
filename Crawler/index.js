var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var Promise = require('bluebird');
var Watson = require('./watson');

var Sites = require('./Sites/index');

var SEARCH_WORD = {
  'aliens': [],
  'butter': [],
  'people': []
};

var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var pagesToVisit = [];
var numPagesVisited = 0;

Promise.each( Sites.sites, (site) => {
  site = 'https://' + site;
  var url = new URL(site);
  var baseUrl = url.protocol + "//" + url.hostname;
  pagesToVisit.push(site);
  crawl();
});

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else if(nextPage === undefined) {
    Watson.toneAnalysis(SEARCH_WORD);
    return;
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

async function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
  console.log("Visiting page " + url);
  var test = await request(url, function(error, response, body) {
      // Check status code (200 is HTTP OK)
      console.log("Status code: " + response.statusCode);
      if(response.statusCode !== 200) {
        callback();
        return;
      }
      // Parse the document body
      var $ = cheerio.load(body, {
        ignoreWhitespace: true
      });
      var wordsFound = searchForWord($, SEARCH_WORD);
      if(wordsFound.length > 0) {
        var captured = captureDomNodes(wordsFound, $);
        callback();
      } else {
        // collectInternalLinks($);
        // In this short program, our callback is just calling crawl()
        callback();
      }
  });
}

function searchForWord($, words) {
  var bodyText = $('html > body').text().toLowerCase();
  // return(bodyText.indexOf(word.toLowerCase()) !== -1);
  var foundKeywords = [];
  for(var property in words){
    var lowerProperty = property.toLowerCase();
    if(bodyText.includes(lowerProperty)){
      foundKeywords.push(lowerProperty);
    }
  }
  return foundKeywords;
}

function captureDomNodes(wordsFound, $, isChild) {
  var aBody = $('html > body').children().find('a');
  aBody.each(function(i, element) {
    var aElement = $(this).text().trim().toLowerCase();
    console.log(aElement);
    wordsFound.forEach(function(word) {
      if(aElement.includes(word)) {
        console.log('word exist: ', word);        
        SEARCH_WORD[word].push(aElement);
      }
    });
  }); 
}

// function collectInternalLinks($) {
//     var relativeLinks = $("a[href^='/']");
//     console.log("Found " + relativeLinks.length + " relative links on page");
//     relativeLinks.each(function() {
//         pagesToVisit.push(baseUrl + $(this).attr('href'));
//     });
// }