'use strict';

const { Wit, log } = require('node-wit');
const witAiToken = process.env.WIT_AI_TOKEN;

const client = new Wit({
  accessToken: witAiToken,
  logger: new log.Logger(log.DEBUG) // optional
});

module.exports.getMessage = function (msg) {
  return client.message(msg, {});
};
