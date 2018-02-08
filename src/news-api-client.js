'use strict';

const request = require('request');
const newsApiKey = process.env.NEWS_API_KEY;

function getLatestPost(searchText, limit) {
  return new Promise((resolve, reject) => {
    request({
      url: 'http://api.newsapi.com.au/uat/content/v2/',
      qs: {
        api_key: newsApiKey,
        query: 'contentType:NEWS_STORY AND keywords:' + searchText,
        offset: 0,
        pageSize: limit
      },
      method: 'GET'
    }, function (error, response, body) {
      if (error) {
        console.log('Error sending messages: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      } else {
        resolve(JSON.parse(response.body));
        return;
      }
      reject(error || response.body.error);
    });
  });
}

module.exports.getLatestPost = getLatestPost;
