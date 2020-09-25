const {Schema, model} = require('mongoose');
const virtualId = require('./contracts/virtualId.contract');
const bcrypt = require('bcryptjs');
const slots = require('./slotNumbers')


let userCardSchema = new Schema({
    front: {type: String, required: true, minlength: 2},
    back: {type: String, required: true, minlength: 2},
    creator: {type: Schema.Types.ObjectID, required: true},
    createdAt: {type: Date, default: Date.now}
});

let cardsBatchSchema = new Schema({
    cards: [userCardSchema],
    id: {type: Number, default: 0, max: 29, min: 0},
});

let userSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    learned: [{type: Schema.Types.ObjectID, ref: 'card'}],
    wantToLearn: [{type: Schema.Types.ObjectID, ref: 'card'}],
    learning: [{type: Schema.Types.ObjectID, ref: 'card'}],
    box: [cardsBatchSchema],
    session: {
        lastSlot: {type: Number, default: slots.zero, min: slots.zero, max: slots.slotFifteen},
        isOpen: {type: Boolean, default: false}
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

virtualId(userSchema);

module.exports = model('user', userSchema);
