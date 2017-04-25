'user strict';

require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var Index = require('../Crawler/index');
var Promise = require('bluebird');
var Watson = require('../Crawler/watson');
var db = require('../Database/config');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/crawl/keywords/:keywords', async (req, res) => {
  var keywords = req.params.keywords;
  var splitKeywords = keywords.split('^');
  Index.keywords = splitKeywords;
  console.log('----------keywords has been split----------');
  var result = await Index.initiate();
  console.log('-----------result after awaiting for Index.initiate----------');
  res.send(JSON.stringify(result, null, 2));
  // res.send(splitKeywords);
})

// async function testing(){
//   var result = await Index.initiate();
//   console.log('--------result------------\n', result);
//   var result2 = JSON.stringify(result, null, 2);
//   console.log('--------result2------------\n', result2);  
// }

// testing();

var port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on port', port);
