const {Schema, model} = require('mongoose')
const virtualId = require('./contracts/virtualId.contract')
const langs = require('./languages.enum')

let cardSchema = new Schema({
    front: {type: String, required: true, minlength: 2, lowercase: true, trim: true},
    back: {type: String, required: true, minlength: 2, trim: true},
    category: {
        name: {type: String, required: true, minlength: 2, trim: true, lowercase: true},
        language: {
            type: String, required: true, minlength: 2,
            validate: {
                validator: function (v) {
                    return !!langs.filter(l => l === v)[0];
                },
                message: props => `${props.value} is not a valid language!`
            }
        },
        id: {type: Schema.Types.ObjectID, required: true},
    },
    synonyms: [String],
    example: {type: String, trim: true, default: ''},
    type: {type: String, trim: true, default: '', maxlength: 17},
    creator: {type: Schema.Types.ObjectID, required: true, ref: 'user'},
    createdAt: {type: Date, default: Date.now}
})

virtualId(cardSchema)

module.exports = {
    CardModel: model('card', cardSchema),
    CardSchema: cardSchema
}
