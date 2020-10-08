const dateExtensions = require('./extentions/Date.extension')
const objectExtensions = require('./extentions/Object.extension')

module.exports = () => {
    dateExtensions()
    objectExtensions()
}
