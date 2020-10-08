const validator = require('../../utils/dataValidator')
module.exports = class PageDto {
    constructor(params = null) {
        this.pageNumber = validator(params, 'pageNumber') || 0
        this.pageSize = validator(params, 'pageSize') || 20
        this.query = validator(params, 'query') || {}
    }
}
