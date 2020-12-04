const express = require('express')
const router = express.Router()
const {checkAsync} = require('./utils/checkApifunctions')
const auth = require('./utils/passportAuthenticator')
const User = require('../models/user.model')
const {CardModel} = require('../models/card.model')
const slots = require('../models/slotNumbers')
const sessionHandler = require('./sessionHandlers')
const _ = require('lodash')

/**
 * remove wrong answers from learning list
 */
router.post('/update-session', auth, checkAsync(async (req, res) => {
    const {correctAnswers, wrongAnswers} = req.body
    const user = (await User.findById(req.user.id)).toJSON()
    const correctCards = await CardModel.find({_id: {$in: correctAnswers}})
    if (!user.session.isOpen)
        return res.badRequest('you do not have an open session')
    const {box, session} = await sessionHandler(user.session.lastSlot)(user, correctCards, wrongAnswers)
    await User.updateOne({_id: req.user.id}, {
        $set: {session, box},
        $pull: {learning: {$in: wrongAnswers}}
    }).exec()
    const data = await getSessionCards(req.user.id, {session, box})
    res.success(data)
}))

router.post('/new-session', auth, checkAsync(async (req, res) => {
    const {session, box} = (await User.findById(req.user.id)).toJSON()
    if (!session.isOpen) {
        session.isOpen = true
        session.lastSlot = slots.slotFifteen
        if (box.length < 30)
            session.lastSlot = slots.slotEight

        if (box.length < 15)
            session.lastSlot = slots.slotFour

        if (box.length < 7)
            session.lastSlot = slots.slotTwo

        if (box.length < 3)
            session.lastSlot = slots.slotOne

        if (box.length < 1)
            session.lastSlot = slots.zero

        await User.updateOne({_id: req.user.id}, {$set: {session}}).exec()
    }
    const data = await getSessionCards(req.user.id, {session, box})
    res.success(data)
}))

router.get('/get-session-cards', auth, checkAsync(async (req, res) => {
    const data = await getSessionCards(req.user.id)
    res.success(data)
}))

async function getSessionCards(userId, user) {
    const {session, box} = user ? user : (await User.findById(userId)).toJSON()
    let cards = []
    if (session.isOpen) {
        switch (session.lastSlot) {
            case slots.zero:
                break
            case slots.slotOne:
                cards = [...(_.find(box, a => a.id === 0)).cards]
                break
            case slots.slotTwo:
                cards = [...(_.find(box, a => a.id === 2)).cards]
                break
            case slots.slotFour:
                cards = [...(_.find(box, a => a.id === 6)).cards]
                break
            case slots.slotEight:
                cards = [...(_.find(box, a => a.id === 14)).cards]
                break
            case slots.slotFifteen:
                cards = [...(_.find(box, a => a.id === 29)).cards]
                break
        }
    }
    return {
        cards,
        session
    }
}

module.exports = router