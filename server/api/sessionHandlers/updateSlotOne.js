const slots = require('../../models/slotNumbers')
module.exports = async (user, correctAnswers) => {
    const {box, session} = user
    const batchCards = {
        cards: correctAnswers,
        id: 1,
    }
    const index = box.findIndex(a => a.id === 2)
    if (index >= 0)
        box.splice(index, 1)
    for (const item of box) {
        if (item.id === 1)
        {
            item.id = 2
            break
        }
    }
    box.push(batchCards)

    session.lastSlot = slots.zero
    return {
        session,
        box
    }
}