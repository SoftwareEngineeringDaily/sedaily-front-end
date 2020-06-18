require('dotenv').config()

var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ENV: process.env.API_ENV ? '"' + process.env.API_ENV + '"' : '"development"',
  SENTRY_DSN: `'${process.env.SENTRY_DSN}'`,
  ALGOLIA_POSTS_INDEX: '"dev_POSTS"',
  ALGOLIA_TOPICS_INDEX: '"dev_TOPICS"',
  ALGOLIA_API_KEY: `'${process.env.ALGOLIA_API_KEY}'`,
  ALGOLIA_APP_ID: `'${process.env.ALGOLIA_APP_ID}'`,
})
