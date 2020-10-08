const Response = require('../dto/responseDto')

function echo(message, data, success, status) {
    this.status(status)
    this.json(
        new Response({
            data: data,
            success: success,
            message: message,
            auth: this.auth
        })
    )
}

function success(data = {}, message = 'action successfully finished') {
    this.echo(message, data, true, 200)
}

function error(message = 'somthing bad happend', status = 500) {
    this.echo(message, {}, false, status)
}

function notFound(message = 'not found') {
    this.echo(message, {}, false, 404)
}

function accessDenied(message = 'access denied') {
    this.echo(message, {}, false, 403)
}

function badRequest(message = 'the request is not valid') {
    this.echo(message, {}, false, 400)
}

function unauthorized(message = 'user is unauthorized') {
    this.echo(message, {}, false, 401)
}

function internalServerError(e) {
    this.ret.echo(e.message || 'somthing bad happend', {}, false, 500)
}

module.exports = function (_, res, next) {
    res.echo = echo
    res.success = success
    res.error = error
    res.notFound = notFound
    res.accessDenied = accessDenied
    res.badRequest = badRequest
    res.unauthorized = unauthorized
    res.internalServerError = internalServerError
    next()
}
