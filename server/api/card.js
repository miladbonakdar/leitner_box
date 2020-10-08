const express = require('express')
const router = express.Router()
const auth = require('./utils/passportAuthenticator')
const {checkAsync} = require('./utils/checkApifunctions')
const {CardModel} = require('../models/card.model')
const User = require('../models/user.model')
const wordsJson = require('../assets/words.json')
const _ = require('lodash')

/**
 * get user favorites
 * */
router.get('/favorites', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate('wantToLearn').exec()
    res.success(user.wantToLearn)
}))

/**
 * get user learned cards
 * */
router.get('/learned/:size/:page', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const learned = user.learned
    const [cards, total] = await Promise.all([CardModel.find({_id: {$in: learned}}, {}, {
        skip: size * page,
        limit: size
    }),
        CardModel.countDocuments({_id: {$in: learned}})])
    res.success({
        cards,
        total,
        page,
        size
    })
}))

/**
 * get user learned cards
 * */
router.get('/learning/:size/:page', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const learning = user.learning
    const [cards, total] = await Promise.all([CardModel.find({_id: {$in: learning}}, {}, {
        skip: size * page,
        limit: size
    }),
        CardModel.countDocuments({_id: {$in: learning}})])
    res.success({
        cards,
        total,
        page,
        size
    })
}))

/**
 * explore new cards for user
 * */
router.get('/suggestions/:size/:page', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const ignoreList = _.union(user.learning, user.learned, user.wantToLearn)
    const [cards, total] = await Promise.all([CardModel.find({_id: {$nin: ignoreList}}, {}, {
        skip: size * page,
        limit: size
    }),
        CardModel.countDocuments({_id: {$nin: ignoreList}})])
    res.success({
        cards,
        total,
        page,
        size
    })
}))

/**
 * get one card
 * */
router.get('/:id', auth, checkAsync(async (req, res) => {
    const cardId = req.params.id
    const card = await CardModel.findById(cardId)
    res.success(card)
}))

/**
 * get one card
 * */
router.get('/list/:size/:page', auth, checkAsync(async (req, res) => {
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const [cards, total] = await Promise.all([
        CardModel.find({}, {}, {skip: size * page, limit: size}).populate('creator').sort('-createdAt'),
        CardModel.countDocuments({})])
    const cardsList = []
    cards.forEach(c => {
        const card = c.toJSON()
        card.canModify = req.user.isAdmin || card.creator.id === req.user.id
        cardsList.push(card)
    })
    res.success({
        cards: cardsList,
        total,
        page,
        size
    })
}))

/**
 * add to favorite
 * */
router.put('/add-to-favorite/:id', auth, checkAsync(async (req, res) => {
    const cardId = req.params.id
    const found = await CardModel.countDocuments({_id: cardId})
    if (!found) return res.notFound()
    await User.findByIdAndUpdate(req.user.id,
        {$addToSet: {wantToLearn: cardId}}, {safe: true, useFindAndModify: false})
    res.success(cardId)
}))

/**
 * add to favorite
 * */
router.delete('/remove-from-favorite/:id', auth, checkAsync(async (req, res) => {
    const cardId = req.params.id
    const found = await CardModel.countDocuments({_id: cardId})
    if (!found) return res.notFound()
    await User.findByIdAndUpdate(req.user.id,
        {$pull: {wantToLearn: {$in: [cardId]}}}, {safe: true, useFindAndModify: false})
    res.success(cardId)
}))

/**
 * create a new card
 * */
router.post('/', auth, checkAsync(async (req, res) => {
    const card = req.body
    card.front = card.front.toLowerCase()
    let cardModel = new CardModel(card)
    cardModel.creator = req.user.id
    cardModel.createdAt = new Date()
    await cardModel.save()
    res.success(cardModel)
}))

/**
 * create a new card
 * */
router.post('/batch-create', auth, checkAsync(async (req, res) => {
    const cardsArray = []
    for (const card of req.body.cards) {
        let cardModel = new CardModel(card)
        cardModel.creator = req.user.id
        cardModel.createdAt = new Date()
        cardsArray.push(cardModel)
    }
    await CardModel.collection.insert(cardsArray)
    res.success(cardsArray)
}))

/**
 * create a new card
 * */
router.post('/load-from-json-file', auth, checkAsync(async (req, res) => {
    if (!req.user.isAdmin) return res.accessDenied('just the admin can load the json file')
    const cardsArray = []
    for (const card of wordsJson) {
        let cardModel = new CardModel({
            front: card.word.toLowerCase(),
            back: card.meaning + (card.example ? ' \nExample : ' + card.example : ''),
        })
        cardModel.creator = req.user.id
        cardModel.createdAt = new Date()
        cardsArray.push(cardModel)
    }
    await CardModel.collection.insert(cardsArray)
    res.success('cards loaded successfully')
}))

/**
 * modify a card
 * */
router.put('/', auth, checkAsync(async (req, res) => {
    const card = req.body
    await CardModel.updateOne({_id: card.id}, {
        $set: {
            front: card.front,
            back: card.back,
        }
    }).exec()
    res.json(card)
}))

/**
 * delete a card
 * */
router.delete('/:id', auth, checkAsync(async (req, res) => {
    const card = await CardModel.findById(req.params.id)
    if (!card)
        return res.notFound()
    const cardJson = card.toJSON()
    if (cardJson.creator !== req.user.id && !req.user.isAdmin)
        return res.accessDenied('just the owner and the admin can delete a card')
    await card.remove()
    await User.updateMany({},
        {
            $pull: {
                wantToLearn: {$in: [card.id]}
                , learning: {$in: [card.id]}
                , learned: {$in: [card.id]}
            }
        }, {safe: true})
    res.success(card, 'card deleted successfully')
}))

/**
 * delete a card
 * */
router.put('/know-the-card/:cardId', auth, checkAsync(async (req, res) => {
    const card = await CardModel.findById(req.params.cardId)
    if (!card)
        return res.notFound()
    await User.updateOne({_id: req.user.id}, {
        $addToSet: {learned: {$each: [card.id]}},
        $pull: {learning: {$in: [card.id]}, wantToLearn: {$in: [card.id]}}
    }).exec()
    res.success(card, 'card marked as learned')
}))

module.exports = router