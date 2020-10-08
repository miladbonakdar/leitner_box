require('dotenv').config()
require('./setGlobalVariables')
require('./utils/classExtentions')()
const express = require('express')
const passport = require('./passport')
const api = require('./api/index')
const cors = require('cors')

require('./models/db/index')(async () => {
    const app = express()
    app.use(cors())
    passport()
    api(app)
})
