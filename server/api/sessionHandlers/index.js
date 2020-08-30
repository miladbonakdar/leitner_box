const updateSlotZero = require('./updateSlotZero')
const updateSlotOne = require('./updateSlotOne')
const updateSlotTwo = require('./updateSlotTwo')
const updateSlotFour = require('./updateSlotFour')
const updateSlotEight = require('./updateSlotEight')
const updateSlotFifteen = require('./updateSlotFifteen')

const slots = require('../../models/slotNumbers')

module.exports = (sessionSlot) => {
    switch (sessionSlot) {
        case slots.zero :
            return updateSlotZero
        case slots.slotOne :
            return updateSlotOne
        case slots.slotTwo :
            return updateSlotTwo
        case slots.slotFour :
            return updateSlotFour
        case slots.slotEight :
            return updateSlotEight
        case slots.slotFifteen :
            return updateSlotFifteen
    }
}