var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Events = require('./Events/Events');

var mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI);

// Run in seperate terminal window using 'mongod'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongodb connection open');
});

// console.log('---------------db-----------------\n', db);
// function find (collec, query, callback) {
//   console.log(mongoose.connection);
//     mongoose.connection.db.collection(collec, function (err, collection) {
//     collection.find(query).toArray(callback);
//     });
// }
// console.log(find('events', { name: 'Iron Maiden with Ghost'}, (err, docs) => console.dir(docs)));


module.exports = db;
