var Crawl = require('./Sites/index');


exports.keywords = [
'beyonce', 'bruno mars', 'apple', 'this', 'burn', 'video', 'ted'
];

exports.initiate = function(){
  console.log('----------crawl.initiatecrawl------------');
  return Crawl.initiateCrawl();
}

//Testing
// Crawl.initiateCrawl();
