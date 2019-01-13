const express = require('express');
const app = express();
const http = require('http');
const request = require('request');
const port = 3000;
const db = require('./db.js')

const spotURL = 'https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0V0CEA8FAAMvZ4ruaZ5PHxbAZO197Sr0e/message.json'

app.get('/', (req, res) => res.send('Hello World'))

app.get('/spot', (req, res) => {
  // TODO if mongo has data, do not request from spotURL
  // have to rate limit spot requests to > 2.5 min between calls for sameid
  // remember if using diff ids, need 2 sec rate limit btwn calls
  request(spotURL, (error, response, body) => {
    if (error) {
      console.log('error:', error);
    }
    const tracks = JSON.parse(body).response.feedMessageResponse.messages.message;
    const uniqueTracks = tracks.map((track)=> {
      let output = {...track};
      output._id = track.id;
      return output;
    });
    db.addTracks(uniqueTracks); // saves iff _id is not a duplicate
    res.send(body);
  })
})

app.listen(port, () => console.log(`app listening on port ${port}`));


module.exports = app;
