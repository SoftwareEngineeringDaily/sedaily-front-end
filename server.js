const sslRedirect = require('heroku-ssl-redirect').default
const express = require('express')
const serveStatic = require('serve-static')
const prerender = require('prerender-node')
const app = express()

// enable ssl redirect
app.use(sslRedirect())

// prerender-node must be used before connect-history-api-fallback
app.use(prerender.set('prerenderToken', process.env.PRERENDER_TOKEN))

const apiUrl = 'https://software-enginnering-daily-api.herokuapp.com/api'

app.get('/rss/public', (_, res) => res.redirect(`${apiUrl}/rss/public/all`))
app.get('/rss/unlimited', (_, res) => res.redirect(`${apiUrl}/rss/public/all_unlimited`))
app.get('/rss/private/:id', (req, res) => res.redirect(`${apiUrl}/rss/private/${req.params.id}`))

app.use(require('connect-history-api-fallback')({
  verbose: true
}))

app.use(serveStatic(__dirname + "/dist"))

const port = process.env.PORT || 5000
app.listen(port)

console.log('server started ' + port)