var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"staging"',
  API_ENV: process.env.API_ENV ? '"' + process.env.API_ENV + '"' : '"staging"'
})
