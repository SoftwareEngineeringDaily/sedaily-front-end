module.exports = {
  NODE_ENV: '"production"',
  API_ENV: process.env.API_ENV ? '"' + process.env.API_ENV + '"' : '"production"',
  EVENT_API_ENV: '"' + process.env.EVENT_API_ENV + '"'
}
