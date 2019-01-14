const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost/tracks';

// Use connect method to connect to the Server
const addTracks = (newTracks) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    const db = client.db('tracks');
    console.log('inside addTrack', newTracks.length)
    db.collection('points').insertMany(
      newTracks
    )
    .then((result) => {
      console.log(result.result);
    })
    client.close();
  });
}


const getTracks = (start, end, cb) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    const db = client.db('tracks');
    const records = db.collection('points').find({
      $and: [{unixTime: {$lt: end + 1}},{unixTime: {$gt: start - 1}}]
    })
    console.log('records.length: ', records.length)

   
   function errorFunc(error) {
      console.log('error: ', error);
   }
   
   records.forEach(cb, errorFunc);
    client.close();
  })
}

const hasCurrent = (start, end, cb) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    const db = client.db('tracks');
    console.log('in here now')
    const numRecs = db.collection('points').countDocuments({
      $and: [{unixTime: {$lt: end + 1}},{unixTime: {$gt: start - 1}}]
    })
    .then((count) => {
      console.log('COUNT! ', count);
      cb(count > 0);
    })
    // console.log(numRecs);
    // const isCurrent = numRecs > 0;
  })
}
const db = {
  addTracks,
  getTracks,
  hasCurrent
}

module.exports = db;
