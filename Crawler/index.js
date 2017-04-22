var Crawl = require('./Sites/index');


exports.keywords = [
'beyonce', 'bruno mars', 'apple', 'this', 'burn', 'video', 'ted'
];

exports.initiate = function(){
  return Crawl.initiateCrawl();
}

//Testing
// Crawl.initiateCrawl();
