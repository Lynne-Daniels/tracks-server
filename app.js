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
  const now = Date.now();
  const updateCurrentTrackPoints = (isCurrent) => {
    // isCurrent - use db
    if (isCurrent) {
      console.log('will do isCurrent stuff')
      //TODO have isCurrent return unixTime of most recent track in DB
      // TODO sort out pagination, multiple requests for big sets. yuk.
      // Do people do that by hand or should I get a library?
      db.getTracks(1, Date.now(), (tracks) => {
        res.send(tracks);
      })
    } else {
      console.log('will do *not* isCurrent stuff')
      // !isCurrent - fetch from API
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
    
        iterateFunc = (doc) => {
          console.log('record: ', JSON.stringify(doc, null, 4));
        }
        db.getTracks(1547312738, 1547321133, iterateFunc)
        res.send(body);
      })
    }
  }
  db.hasCurrent(now -180, now, updateCurrentTrackPoints)
  // have to rate limit spot requests to > 2.5 min between calls for sameid
  // remember if using diff ids, need 2 sec rate limit btwn calls
  // res.send('comment this out later');
})

app.listen(port, () => console.log(`app listening on port ${port}`));


module.exports = app;
