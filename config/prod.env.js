module.exports = {
  NODE_ENV: '"production"',
  API_ENV: process.env.API_ENV ? '"' + process.env.API_ENV + '"' : '"production"',
  EVENT_API_ENV: '"' + process.env.EVENT_API_ENV + '"',
  ALGOLIA_POSTS_INDEX: '"prod_POSTS"',
  ALGOLIA_APP_ID: '"FB77EIL2W1"',
  ALGOLIA_API_KEY: '"f4417d19c31300cc3519d46c66e05849"',
}
