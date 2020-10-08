const {Schema, model} = require('mongoose')
const virtualId = require('./contracts/virtualId.contract')

let cardSchema = new Schema({
    front: {type: String, required: true, minlength: 2, unique: true},
    back: {type: String, required: true, minlength: 2},
    creator: {type: Schema.Types.ObjectID, required: true, ref: 'user'},
    createdAt: {type: Date, default: Date.now}
})

virtualId(cardSchema)

module.exports = {
    CardModel: model('card', cardSchema),
    CardSchema: cardSchema
}
