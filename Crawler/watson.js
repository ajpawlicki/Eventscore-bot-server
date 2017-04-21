var watson = require('watson-developer-cloud');
var Promise = require('bluebird');

exports.toneAnalysis = function(data) {
  //TODO: Move credentials to env file and git ignore it
  var tone_analyzer = watson.tone_analyzer({
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
    username: 'ac72f237-bca2-4ab7-819a-a5df2efa9d43',
    password: 'Cz8rt4v5sXWa',
    version: 'v3',
    version_date: '2016-05-19',
  });

  return cleanupInputData(data)
  .then((concatData) => {
    var topics = []
    for (var property in concatData) {
      topics.push([property, concatData[property], concatData[property].length]);
    }
    return topics;
  })
  .then((topics) => {
    return Promise.all(
      topics.map((topic) => {
        return new Promise((resolve, reject) => {
          tone_analyzer.tone({ text: JSON.stringify(topic[1]), sentences: false }, (err, tone) => {
            if(err) {
              console.log('ERROR: ', err);
            } else {
              var answer = {};
              answer.keyword = topic[0];
              answer.instances = topic[2];
              answer.watsonScore = tone;
              console.log('answer', answer);
              resolve(answer);
            }
          })
        })
      })
    );
  })
  .then((result) => {
    var cleanData = cleanupOutputData(result);
    return cleanData;
  });
}

function cleanupInputData(data) {
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

function cleanupOutputData(data) {
  return new Promise((resolve, reject) => {
    var cleanData = data.map((element) => {
      var obj = {};
      obj.keyword = element.keyword;
      obj.instances = element.instances;
      obj.watsonCategoryRaw = element.watsonScore.document_tone.tone_categories;
      obj.watsonToneAnger = obj.watsonCategoryRaw[0].tones[0].score;
      obj.watsonToneDisgust = obj.watsonCategoryRaw[0].tones[1].score;
      obj.watsonToneFear = obj.watsonCategoryRaw[0].tones[2].score;
      obj.watsonToneJoy = obj.watsonCategoryRaw[0].tones[3].score;
      obj.watsonToneSadness = obj.watsonCategoryRaw[0].tones[4].score;
      obj.negativeScore = (obj.watsonToneAnger + obj.watsonToneDisgust + obj.watsonToneFear + obj.watsonToneSadness)/4;
      obj.score = (obj.watsonToneJoy + obj.negativeScore)/2;
      return obj;
    });
    resolve(cleanData);
  })
}
