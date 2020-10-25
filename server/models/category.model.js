const {Schema, model} = require('mongoose')
const virtualId = require('./contracts/virtualId.contract')
const virtualRating = require('./contracts/virtualRating.contract')
const languages = require('./languages.enum')

let categorySchema = new Schema({
    name: {type: String, required: true, minlength: 2, trim: true},
    language: {
        type: String, required: true, minlength: 2,
        validate: {
            validator: function (v) {
                return !!languages.filter(l => l === v)[0];
            },
            message: props => `${props.value} is not a valid language!`
        }
    },
    isPrivate: {type: Boolean, required: true, default: true},
    creator: {type: Schema.Types.ObjectID, required: true, ref: 'user'},
    createdAt: {type: Date, default: Date.now},
    rating : [{
        userId : {type: Schema.Types.ObjectID, required: true, ref: 'user'},
        rate : {type: Number, required: true, default: 5, max:5, min:0}
    }]
})

virtualId(categorySchema)
virtualRating(categorySchema)

module.exports = {
    CategoryModel: model('category', categorySchema),
    CategorySchema: categorySchema
}
