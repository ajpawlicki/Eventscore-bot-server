var watson = require('watson-developer-cloud');
var Promise = require('bluebird');


exports.toneAnalysis = function(data) {

  console.log('-----------INSIDE WATSON ----------\n', data);
  var tone_analyzer = watson.tone_analyzer({
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
    username: 'ac72f237-bca2-4ab7-819a-a5df2efa9d43',
    password: 'Cz8rt4v5sXWa',
    version: 'v3',
    version_date: '2016-05-19',
  });

  cleanupData(data).then((concatData) => {
    var topics = []
    for (var property in concatData) {
      topics.push([property, concatData[property]]);
    }
    console.log('topics', topics);
    
    Promise.all(
      topics.map((topic) => {
        return new Promise((resolve, reject) => {
          tone_analyzer.tone({text: JSON.stringify(topic[1])}, (err, tone) => {
            if(err) {
              console.log('ERROR: ', err);
            } else {
              var answer = {};
              answer.keyword = topic[0];
              answer.watsonScore = tone;
              console.log('answer', answer);
              resolve(answer);
            }
          });
        });
      })
    ).then((result) => console.log('--------------RESULT--------------', JSON.stringify(result)));


  })

//   var watsonAnalysis = {};
  cleanupData(data).then((concatData) => {
    console.log('concat data: ', concatData);
    var watsonAnalysis = {};
    for(var property in concatData) {
      if(concatData[property].length > 0) {
        console.log('--------ANALYZE THE TONE HERE---------');
        tone_analyzer.tone({text: JSON.stringify(concatData[property])}, (err, tone) => {
          if(err) {
            console.log('ERROR: ', err);
          } else {
            watsonAnalysis[property] = tone;
          }
        });
      }
    }
    return watsonAnalysis;
  }).then((result) => {console.log('watsonAnalysis: ', result)});
}

function cleanupData(data){
  return new Promise((resolve, reject) => {
    var cleanData = data.reduce((acc, cur) => {
      for(var property in cur) {
        if(property === 'hostname') {
          return acc;
        } else if(acc[property] === undefined) {
          acc[property] = cur[property];
        } else {
          acc[property] = acc[property].concat(cur[property]);
        }
      }
      return acc;
    }, {});
    resolve(cleanData);
  });
}
