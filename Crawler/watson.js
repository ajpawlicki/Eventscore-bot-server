var watson = require('watson-developer-cloud');
var Promise = require('bluebird');

exports.toneAnalysis = function(data) {
  //TODO: Move credentials to env file and git ignore it
  var tone_analyzer = watson.tone_analyzer({
    url: process.env.WATSON_URL,
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    version: process.env.WATSON_VERSION,
    version_date: process.env.WATSON_VERSION_DATE,
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
    for(var property in cleanData) {
      if(cleanData[property].length === 0) {
        delete cleanData[property];
      }
    }
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
      obj.score = ((obj.watsonToneJoy - obj.negativeScore)+100)/2;
      return obj;
    });
    resolve(cleanData);
  })
}
