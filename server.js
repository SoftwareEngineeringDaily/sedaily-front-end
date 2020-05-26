const sslRedirect = require('heroku-ssl-redirect')
const express = require('express')
const serveStatic = require('serve-static')
const app = express()

const apiUrl = 'https://software-enginnering-daily-api.herokuapp.com/api'
app.get('/rss/public', (_, res) => res.redirect(`${apiUrl}/rss/public/all`))
app.get('/rss/unlimited', (_, res) => res.redirect(`${apiUrl}/rss/public/all_unlimited`))
app.get('/rss/private/:id', (req, res) => res.redirect(`${apiUrl}/rss/private/${req.params.id}`))

// prerender-node must be used before connect-history-api-fallback
app.use(require('prerender-node')
  .set('prerenderToken', process.env.PRERENDER_TOKEN)
)

app.use(require('connect-history-api-fallback')({
  verbose: true
}))

app.use(serveStatic(__dirname + "/dist"))

// enable ssl redirect
app.use(sslRedirect())

const port = process.env.PORT || 5000
app.listen(port)

console.log('server started ' + port)
