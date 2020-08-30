const slots = require('../../models/slotNumbers')
module.exports = async (user, correctAnswers) => {
    const {box, session} = user
    const batchCards = {
        cards: correctAnswers,
        id: 7,
    }
    const index = box.findIndex(a => a.id === 14)
    const indexesForUpdate = [7, 8, 9, 10, 11, 12, 13]
    if (index >= 0)
        box.splice(index, 1)
    for (const item of box) {
        if (indexesForUpdate.some(a => a === item.id))
            item.id = item.id + 1
    }
    box.push(batchCards)

    session.lastSlot = slots.slotTwo
    return {
        session,
        box
    }
}