var watson = require('watson-developer-cloud');
var Promise = require('bluebird');


exports.toneAnalysis = async function(obj){
    
  //Expired credentials
  var tone_analyzer = watson.tone_analyzer({
    username: '9863b442-ec81-4266-acca-d2d99001883d',
    password: 'MwOfmXcl3Gyz',
    version: 'v3',
    version_date: '2016-05-19',
  });

  console.log(obj);

  var topicArray = Object.keys(obj);

  Promise.each(topicArray, (topic) => {
    tone_analyzer.tone({text: obj[topic], sentences: true}, (err, tone) => {
      if ( )
    }
  });

    tone_analyzer.tone()
}