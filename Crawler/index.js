var Crawl = require('./Sites/index');

exports.keywords = [
'beyonce', 'bruno mars', 'apple'
];

exports.initiate = function(){
  return Crawl.initiateCrawl();
}
