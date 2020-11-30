const express = require('express')
const router = express.Router()
const auth = require('./utils/passportAuthenticator')
const {checkAsync} = require('./utils/checkApifunctions')
const {CardModel} = require('../models/card.model')
const User = require('../models/user.model')
const wordsJson = require('../assets/words.json')
const _ = require('lodash')
const {CategoryModel} = require("../models/category.model");
const {mediumLvl, highLvl, lowLevel} = require('./utils/rateLimits')
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
    const search = req.query.search && req.query.search.toLowerCase()
    const ignoreList = _.union(user.learning, user.learned)
    const [cards, total] = await Promise.all([
        CardModel.find({
            _id: {$nin: ignoreList},
            ...(user.selectedCategories && {'category.id': {$in: user.selectedCategories}}),
            ...(search && {front: {$regex: search, $options: "i"}})
        }, {}, {
            skip: size * page,
            limit: size
        }),
        CardModel.countDocuments({
            _id: {$nin: ignoreList},
            ...(user.selectedCategories && {'category.id': {$in: user.selectedCategories}}),
            ...(search && {front: {$regex: search, $options: "i"}})
        })])
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
router.get('/random-suggestions/:size', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
    const size = Number(req.params.size)
    const ignoreList = _.union(user.learning, user.learned)
    const cards = await CardModel.aggregate(
        [{$match: {_id: {$nin: ignoreList}}},
            {$sample: {size: size}}]
    ).exec()
    for (const card of cards) {
        card.id = card._id
    }
    res.success({
        cards,
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
    const search = req.query.search && req.query.search.toLowerCase()
    const [cards, total] = await Promise.all([
        CardModel.find({
            ...(search && {front: {$regex: search, $options: "i"}})
        }, {}, {skip: size * page, limit: size}).populate('creator', {
            name: true,
            isAdmin: true,
            username: true,
            id: true,
            _id: true
        }).sort('-createdAt'),
        CardModel.countDocuments({
            ...(search && {front: {$regex: search, $options: "i"}})
        })])
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
 * create a new card
 * */
router.post('/', auth, mediumLvl, checkAsync(async (req, res) => {
    const card = req.body
    if (!card.categoryId)
        return res.badRequest('category is not selected')
    const category = await CategoryModel.findById(card.categoryId)
    if (!category)
        return res.notFound('category cannot be found')
    delete card.categoryId
    card.category = category.toJSON()
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
router.post('/batch-create', highLvl, auth, checkAsync(async (req, res) => {
    const cardsArray = []
    if (!req.body.categoryId) return res.badRequest('category is not selected')
    const category = await CategoryModel.findById(req.body.categoryId)
    if (!category)
        return res.notFound('category cannot be found')
    const catObject = category.toJSON()
    for (const card of req.body.cards) {
        let cardModel = new CardModel(card)
        cardModel.creator = req.user.id
        cardModel.category = catObject
        cardModel.createdAt = new Date()
        cardsArray.push(cardModel)
    }
    await CardModel.collection.insert(cardsArray)
    res.success(cardsArray)
}))

/**
 * create a new card
 * //TODO: change this section
 * */
router.post('/load-from-json-file', highLvl, auth, checkAsync(async (req, res) => {
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
router.put('/', mediumLvl, auth, checkAsync(async (req, res) => {
    const card = req.body
    await CardModel.updateOne({_id: card.id}, {
        $set: {
            front: card.front,
            back: card.back,
            synonyms: card.synonyms,
            type: card.type,
            example: card.example,
        }
    }).exec()
    res.json(card)
}))

/**
 * delete a card
 * */
router.delete('/:id', mediumLvl, auth, checkAsync(async (req, res) => {
    const card = await CardModel.findById(req.params.id)
    if (!card) return res.notFound()
    const cardJson = card.toJSON()
    if (cardJson.creator.toString() !== req.user.id && !req.user.isAdmin)
        return res.accessDenied('just the owner and the admin can delete a card')
    await card.remove()
    await User.updateMany({},
        {
            $pull: {
                learning: {$in: [card.id]}
                , learned: {$in: [card.id]}
            }
        }, {safe: true})
    res.success(card, 'card deleted successfully')
}))

/**
 * delete a card
 * */
router.put('/know-the-card/:cardId', lowLevel, auth, checkAsync(async (req, res) => {
    const card = await CardModel.findById(req.params.cardId)
    if (!card) return res.notFound()
    await User.updateOne({_id: req.user.id}, {
        $addToSet: {learned: {$each: [card.id]}},
        $pull: {learning: {$in: [card.id]}}
    }).exec()
    res.success(card, 'card marked as learned')
}))

module.exports = router