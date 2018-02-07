'use strict';

const messagesBuilder = require('./messages-builder');
const token = process.env.FB_PAGE_ACCESS_TOKEN;

function webook(app) {
// for Facebook verification
  app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.PRIVATE_KEY) {
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
        if (text === 'Generic') {
          messagesBuilder.sendGenericMessage(sender);
          continue;
        }
        messagesBuilder.sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200));
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback);
        messagesBuilder.sendTextMessage(sender, 'Postback received: ' + text.substring(0, 200), token);
        continue;
      }
    }
    res.sendStatus(200);
  });
}

module.exports = webook;
