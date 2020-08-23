const {Schema, model} = require('mongoose');
const virtualId = require('./contracts/virtualId.contract');
const {CardSchema} = require('./card.model');
const bcrypt = require('bcryptjs');

let cardsBatchSchema = new Schema({
    cards: [CardSchema],
});

let userSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    learned: [Schema.Types.ObjectID],
    wantToLearn: [Schema.Types.ObjectID],
    learning: [Schema.Types.ObjectID],
    box: {
        slotOne: [cardsBatchSchema],
        slotTwo: [cardsBatchSchema],
        slotFour: [cardsBatchSchema],
        slotEight: [cardsBatchSchema],
        slotFifteen: [cardsBatchSchema]
    },
    session: {
        sessionId: {type: Schema.Types.ObjectID},
        lastSlot: {type: Number},
        isOpen: {type: Boolean, default: false}
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

virtualId(userSchema);

module.exports = model('user', userSchema);
