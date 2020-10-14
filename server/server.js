require('dotenv')
    .config({path: process.env.NODE_ENV !== 'production' ? '.env' : '.env.production'})

require('./setGlobalVariables')
require('./utils/classExtentions')()
const serveStatic = require('serve-static');
const express = require('express')
const passport = require('./passport')
const api = require('./api/index')
const cors = require('cors')
const history = require('connect-history-api-fallback')

require('./models/db/index')(async () => {
    const app = express()
    app.use(history())
    app.use(serveStatic(__dirname + "/client_dest"));
    app.use(cors())
    passport()
    api(app)
})
