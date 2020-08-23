const {Schema, model} = require('mongoose');
const virtualId = require('./contracts/virtualId.contract');

let cardSchema = new Schema({
    front: {type: String, required: true},
    back: {type: String, required: true, unique: true},
    creator: {type: Schema.Types.ObjectID, required: true},
    createdAt: {type: Date, default: Date.now}
});

virtualId(cardSchema);

module.exports = {
    CardModel: model('card', cardSchema),
    CardSchema: cardSchema
}
