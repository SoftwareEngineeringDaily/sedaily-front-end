module.exports = {
  NODE_ENV: '"production"',
  API_ENV: process.env.API_ENV ? '"' + process.env.API_ENV + '"' : '"production"',
  EVENT_API_ENV: '"' + process.env.EVENT_API_ENV + '"',
  ALGOLIA_POSTS_INDEX: '"prod_POSTS"',
  ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
}
