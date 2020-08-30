const slots = require('../../models/slotNumbers')
module.exports = async (user, correctAnswers) => {
    const {box, session} = user
    const batchCards = {
        cards: correctAnswers,
        id: 3,
    }
    const index = box.findIndex(a => a.id === 6)
    const indexesForUpdate = [3, 4, 5]
    if (index >= 0)
        box.splice(index, 1)
    for (const item of box) {
        if (indexesForUpdate.some(a => a === item.id))
            item.id = item.id + 1
    }
    box.push(batchCards)

    session.lastSlot = slots.slotOne
    return {
        session,
        box
    }
}