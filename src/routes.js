'use strict';

const witAiClient = require('./witai-client');

function handleRoute(app) {
  app.get('/search-wit-ai', function (req, res) {
    witAiClient.getMessage(req.query.text).then(result =>{
      res.send(result);
    }, reason =>{
      res.status(400);
      res.send('Bad request');
    });
  });
}

module.exports = handleRoute;
