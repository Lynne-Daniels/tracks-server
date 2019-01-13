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
// TODO retreive tracks

const db = {
  addTracks
}

module.exports = db;
