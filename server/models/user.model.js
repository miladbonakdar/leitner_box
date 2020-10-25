import emailValidator from "../utils/emailValidator";

const {Schema, model} = require('mongoose')
const virtualId = require('./contracts/virtualId.contract')
const bcrypt = require('bcryptjs')
const slots = require('./slotNumbers')


let userCardSchema = new Schema({
    front: {type: String, required: true, minlength: 2},
    back: {type: String, required: true, minlength: 2},
    creator: {type: Schema.Types.ObjectID, required: true},
    createdAt: {type: Date, default: Date.now},
    category: {
        name: {type: String, required: true, minlength: 2, trim: true, lowercase: true},
        language: {type: String, required: true, minlength: 2},
        id: {type: Schema.Types.ObjectID, required: true},
    },
    synonyms: [String],
    example: {type: String, trim: true, default: ''},
    type: {type: String, trim: true, default: '', maxlength: 17},
})

let cardsBatchSchema = new Schema({
    cards: [userCardSchema],
    id: {type: Number, default: 0, max: 29, min: 0},
})

let userSchema = new Schema({
    name: {type: String, required: true, trim: true, lowercase: true},
    username: {
        type: String, required: true, unique: true, trim: true, lowercase: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9]+$/.test(v);
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    email: {
        type: String, required: true, unique: true, trim: true, lowercase: true,
        validate: {
            validator: function (v) {
                return emailValidator(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {type: String, required: true, minlength: 6},
    learned: [{type: Schema.Types.ObjectID, ref: 'card'}],
    selectedCategories: [{type: Schema.Types.ObjectID, ref: 'category'}],
    learning: [{type: Schema.Types.ObjectID, ref: 'card'}],
    isAdmin: {type: Boolean, default: false},
    box: [cardsBatchSchema],
    session: {
        lastSlot: {type: Number, default: slots.zero, min: slots.zero, max: slots.slotFifteen},
        isOpen: {type: Boolean, default: false}
    }
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

virtualId(userSchema)

module.exports = model('user', userSchema)
