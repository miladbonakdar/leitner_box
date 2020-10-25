const User = require('../../models/user.model')
module.exports = async (user, correctAnswers) => {
    const {box, session, id} = user

    const correctCardIds = correctAnswers.map(c => c._id)
    await User.updateOne({_id: id}, {
        $addToSet: {learning: {$each: correctCardIds}}
    }).exec();

    const batchCards = {
        cards: correctAnswers,
        id: 0,
    }
    const index = box.findIndex(a => a.id === 0)
    if (index >= 0)
        box.splice(index, 1)
    box.push(batchCards)
    session.isOpen = false
    return {
        session,
        box
    }
}