const express = require('express')
const serveStatic = require('serve-static')
const cors = require('cors')

const app = express()
const whitelist = [
  'http://localhost:4040',
  'https://sedaily-backend-staging.herokuapp.com',
  'https://software-enginnering-daily-api.herokuapp.com',
]

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  methods: 'GET',
}))

// prerender-node must be used before connect-history-api-fallback
app.use(require('prerender-node')
  .set('prerenderToken', process.env.PRERENDER_TOKEN)
)

app.use(require('connect-history-api-fallback')({
  verbose: true
}))

app.use(serveStatic(__dirname + "/dist"))

const port = process.env.PORT || 5000
app.listen(port)

console.log('server started ' + port)
