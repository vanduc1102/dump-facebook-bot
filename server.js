'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const compression = require('compression');


app.set('port', (process.env.PORT || 3000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());
app.use(express.static('public'));
// Process application/json
app.use(bodyParser.json());

require('./src/webhook')(app);
require('./src/routes')(app);

// Spin up the server
app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'));
});
