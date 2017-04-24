var test = require('tape');
var request = require('supertest');
var server = require('./Server/index');
var crawlerIndex = require('./Crawler/index');

/*Sample test*/
// test('should include some keywords', (assert) => {
//   var keywords = crawlerIndex.keywords;
//   assert.equal(keywords.length, 3);
//   assert.end();
// });

test('GET /things', function (assert) {
  request(app)
    .get('/api/crawl/keywords/bruno mars^lady gaga^usher')
    .expect(200)
    .end(function (err, res) {
      var expectedThings = [
        bruno mars,lady gaga,usher
      ];
      var actualThings = res.params.keywords;
 
      assert.error(err, 'No error');
      assert.same(actualThings, expectedThings, 'Retrieve list of things');
      assert.end();
    });
});