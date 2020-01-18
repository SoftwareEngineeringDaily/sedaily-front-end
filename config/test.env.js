var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"staging"',
  API_ENV: process.env.API_ENV ? '"' + process.env.API_ENV + '"' : '"staging"',
  ALGOLIA_POSTS_INDEX: '"dev_POSTS"',
  ALGOLIA_APP_ID: '"FB77EIL2W1"',
  ALGOLIA_API_KEY: '"f4417d19c31300cc3519d46c66e05849"',
})
