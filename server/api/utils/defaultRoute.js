module.exports = (req, res) => {
    res.status(404)
    if (req.accepts('json')) {
        res.send({ error: 'Not found' })
        return
    }
    res.type('txt').send('Not found')
}
