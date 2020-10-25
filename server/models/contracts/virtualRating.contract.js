module.exports = schema => {
    schema.virtual('rate').get(function() {
        return this.rating.reduce((a, b) => a + b, 0) / this.rating.length
    })
}
