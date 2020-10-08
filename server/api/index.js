const auth = require('./auth')
const card = require('./card')
const leitner = require('./leitner')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const defaultRoute = require('./utils/defaultRoute')
const errorHandler = require('./utils/expressErrorHandler')
const customResponse = require('./utils/response')
const appConfig = require('../app.config.js').get()

const onServerStartedSuccessfully = () => {
    console.log(`Server is up and running on port ${appConfig.apiPortNumber}`)
}

const setupMiddlewares = app => {
    app.use(logger('common'))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(bodyParser.json())
    app.use(customResponse)
}

module.exports = app => {
    setupMiddlewares(app)
    app.use('/api-v1/auth', auth)
    app.use('/api-v1/card', card)
    app.use('/api-v1/leitner', leitner)
    app.use(defaultRoute)
    app.use(errorHandler)
    app.listen(appConfig.apiPortNumber, onServerStartedSuccessfully)
}
