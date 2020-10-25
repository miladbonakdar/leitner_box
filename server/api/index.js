const auth = require('./auth')
const card = require('./card')
const leitner = require('./leitner')
const publicApi = require('./public')
const categoryApi = require('./category')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const defaultRoute = require('./utils/defaultRoute')
const errorHandler = require('./utils/expressErrorHandler')
const customResponse = require('./utils/response')
const appConfig = require('../app.config.js').get()
const {mediumLvl, lowLevel} = require('./utils/rateLimits')

const onServerStartedSuccessfully = () => {
    console.log(`Server is up and running on port ${appConfig.apiPortNumber}`)
}

const setupMiddlewares = app => {
    app.use(logger('common'))
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cookieParser())
    app.use(bodyParser.json())
    app.use(customResponse)
}

module.exports = app => {
    setupMiddlewares(app)
    app.use('/api-v1/auth', auth)
    app.use('/api-v1/card', card)
    app.use('/api-v1/leitner', lowLevel, leitner)
    app.use('/api-v1/public', lowLevel, publicApi)
    app.use('/api-v1/category', mediumLvl, categoryApi)
    app.use(defaultRoute)
    app.use(errorHandler)
    app.listen(appConfig.apiPortNumber, onServerStartedSuccessfully)
}
