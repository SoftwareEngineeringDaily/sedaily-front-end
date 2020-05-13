require('dotenv').config()

var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"staging"',
  API_ENV: process.env.API_ENV ? '"' + process.env.API_ENV + '"' : '"staging"',
  ALGOLIA_POSTS_INDEX: '"dev_POSTS"',
  ALGOLIA_TOPICS_INDEX: '"dev_TOPICS"',
  ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
})
