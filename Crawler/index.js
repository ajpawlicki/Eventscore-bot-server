var Crawl = require('./Sites/index');


exports.keywords = [
'beyonce', 'bruno mars', 'apple', 'this'
];

exports.initiate = function(){
  return Crawl.initiateCrawl();
}

//Testing
// Crawl.initiateCrawl();
