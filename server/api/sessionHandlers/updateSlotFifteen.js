const slots = require('../../models/slotNumbers')
const User = require('../../models/user.model')
module.exports = async (user, correctAnswers) => {
    const {box, session, id} = user
    const correctCardIds = correctAnswers.map(c => c._id)
    await User.updateOne({_id: id}, {
        $addToSet: {learned: {$each: correctCardIds}}
    }).exec();

    session.lastSlot = slots.slotEight
    return {
        session,
        box
    }
}