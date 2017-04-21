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
  var splitKeywords = keywords.split('&');
  Index.keywords = splitKeywords;
  var result = await Index.initiate();
  res.send(JSON.stringify(result, null, 2));
})

var port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on port', port);
