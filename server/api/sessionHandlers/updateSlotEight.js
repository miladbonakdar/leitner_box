const slots = require('../../models/slotNumbers')
module.exports = async (user, correctAnswers) => {
    const {box, session} = user
    const batchCards = {
        cards: correctAnswers,
        id: 15,
    }
    const index = box.findIndex(a => a.id === 29)
    const indexesForUpdate = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
    if (index >= 0)
        box.splice(index, 1)
    for (const item of box) {
        if (indexesForUpdate.some(a => a === item.id))
            item.id = item.id + 1
    }
    box.push(batchCards)

    session.lastSlot = slots.slotFour
    return {
        session,
        box
    }
}