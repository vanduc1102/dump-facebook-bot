'use strict';

const messagesBuilder = require('./messages-builder');
const webhookPrivateKey = process.env.PRIVATE_KEY;
const witAiClient = require('./witai-client');


function webook(app) {
  app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === webhookPrivateKey) {
      res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
  });

  app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i];
      let sender = event.sender.id;
      if (event.message && event.message.text) {
        let text = event.message.text;
        witAiClient.getMessage(text).then(res => {
          let entities = res.entities;
          let searchText = entities && entities.search_query && entities.search_query[0].value ? entities.search_query[0].value : '';
          if (searchText) {
            messagesBuilder.sendGenericMessage(sender, searchText);
          } else {
            messagesBuilder.sendTextMessage(sender, 'Sorry, I don\'t understand : ' + text.substring(0, 200));
          }
        });
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback);
        messagesBuilder.sendTextMessage(sender, 'Thank you.');
        continue;
      }
    }
    res.sendStatus(200);
  });
}

module.exports = webook;
