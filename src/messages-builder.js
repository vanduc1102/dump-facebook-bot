'use strict';

const request = require('request');
const token = process.env.FB_PAGE_ACCESS_TOKEN;
const newsApiClient = require('./news-api-client');
const MAX_POST_NUMBER = 5;
var MSG_TEMPLATE = {
  'attachment': {
    'type': 'template',
    'payload': {
      'template_type': 'generic',
      'elements': null
    }
  }
};

function sendTextMessage(sender, text) {
  let messageData = { text: text };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: token
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendGenericMessage(sender, text) {
  createPostsCarousel(text).then(messageData => {
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: token
      },
      method: 'POST',
      json: {
        recipient: {
          id: sender
        },
        message: messageData
      }
    }, function (error, response, body) {
      if (error) {
        console.log('Error sending messages: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  }, reason =>{
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: token
      },
      method: 'POST',
      json: {
        recipient: {
          id: sender
        },
        message: { text: 'No result for ' + text }
      }
    }, function (error, response, body) {
      if (error) {
        console.log('Error sending messages: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  });
}

function createPostsCarousel(text) {
  return new Promise((resolve, reject) =>{
    newsApiClient.getLatestPost(text, MAX_POST_NUMBER).then(
      response =>{
        resolve(createCarouselMessage(response.results));
      },
      reason => {
        reject(MSG_TEMPLATE);
      }
    );
  });
}

function createCarouselMessage(posts) {
  let templates = MSG_TEMPLATE;
  let elements = [];
  posts.forEach((post) =>{
    console.log('post : ', post);
    elements.push({
      'title': post.title,
      'subtitle': post.description,
      'image_url': (post.thumbnailImage && post.thumbnailImage.link) || 'https://secure-assets.rubiconproject.com/campaigns/7725/50/20/68/1475124163campaign_file_lhtc0d.jpg',
      'default_action': {
        'type': 'web_url',
        'url': post.link,
        'messenger_extensions': false,
        'webview_height_ratio': 'FULL'
      },
      'buttons': [
        {
          'type': 'web_url',
          'url': post.link,
          'title': 'View Website'
        },
        {
          'type': 'postback',
          'title': 'Like it?',
          'payload': 'Yes'
        }
      ]
    });
  });
  templates.attachment.payload.elements = elements;
  return templates;
}


module.exports = {
  sendTextMessage: sendTextMessage,
  sendGenericMessage: sendGenericMessage
};
