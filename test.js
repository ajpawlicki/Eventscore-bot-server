var test = require('tape');
var server = require('./Server/index');
var crawlerIndex = require('./Crawler/index');

test('should include some keywords', (assert) => {
  var keywords = crawlerIndex.keywords;
  assert.equal(keywords.length, 3);
  assert.end();
});

