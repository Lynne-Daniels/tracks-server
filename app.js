const express = require('express');
const app = express();
const http = require('http');
const request = require('request');
const port = 3000;

const spotURL = 'https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0V0CEA8FAAMvZ4ruaZ5PHxbAZO197Sr0e/message.json'

app.get('/', (req, res) => res.send('Hello World'))

app.get('/spot', (req, res) => {
  request(spotURL, (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body);
    console.log('as JSON',JSON.parse(body));
    res.send(body);
  })
  //.then(res.send(body)); --> body not defined
  // res.send('TODO Data goes here -- test nodemon');
})

app.listen(port, () => console.log(`app listening on port ${port}`));
