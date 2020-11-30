module.exports = schema => {
    schema.virtual('rate').get(function () {
        if (!this.rating) return null
        const sum = this.rating.reduce((a, b) => a + b.rate, 0)
        return sum / this.rating.length
    })
}
