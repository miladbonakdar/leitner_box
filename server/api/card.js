const express = require('express');
const router = express.Router();
const auth = require('./utils/passportAuthenticator');
const {checkAsync} = require('./utils/checkApifunctions');
const {CardModel} = require('../models/card.model');
const User = require('../models/user.model');
const _ = require('lodash');

/**
 * get user favorites
 * */
router.get('/favorites', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate('wantToLearn').exec();
    res.success(user.wantToLearn);
}));

/**
 * get user learned cards
 * */
router.get('/learned/:size/:page', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const learned = user.learned
    const cards = await CardModel.find({_id: {$in: learned}}, {}, {skip: size * page, limit: size})
    const total = await CardModel.countDocuments({_id: {$in: learned}})
    res.success({
        cards,
        total,
        page,
        size
    });
}));

/**
 * get user learned cards
 * */
router.get('/learning/:size/:page', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const learning = user.learning
    const cards = await CardModel.find({_id: {$in: learning}}, {}, {skip: size * page, limit: size})
    const total = await CardModel.countDocuments({_id: {$in: learning}})
    res.success({
        cards,
        total,
        page,
        size
    });
}));

/**
 * explore new cards for user
 * */
router.get('/suggestions/:size/:page', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const ignoreList = _.union(user.learning,user.learned,user.wantToLearn)
    const cards = await CardModel.find({_id: {$nin: ignoreList}}, {}, {skip: size * page, limit: size})
    const total = await CardModel.countDocuments({_id: {$in: ignoreList}})
    res.success({
        cards,
        total,
        page,
        size
    })
}));

/**
 * get one card
 * */
router.get('/:id', auth, checkAsync(async (req, res) => {
    const cardId = req.params.id
    const card = await CardModel.findById(cardId);
    res.success(card);
}));

/**
 * add to favorite
 * */
router.put('/add-to-favorite/:id', auth, checkAsync(async (req, res) => {
    const cardId = req.params.id
    const found = await CardModel.countDocuments({_id: cardId})
    if (!found) {
        res.notFound()
        return
    }
    const user = (await User.findById(req.user.id)).toJSON()
    for (const card of user.wantToLearn) {
        if (card.toString() === cardId) {
            res.success(cardId)
            return;
        }
    }
    user.wantToLearn = _.union([cardId], user.wantToLearn)
    await User.updateOne({_id: req.user.id}, {$set: user}).exec()
    res.success(cardId)
}));

/**
 * add to favorite
 * */
router.delete('/remove-from-favorite/:id', auth, checkAsync(async (req, res) => {
    const cardId = req.params.id
    const found = await CardModel.countDocuments({_id: cardId})
    if (!found) {
        res.notFound()
        return
    }
    await User.findByIdAndUpdate(req.user.id,
        {$pull: {wantToLearn: {$in: [cardId]}}}, {safe: true, upsert: true, useFindAndModify: false})
    res.success(cardId)
}));

/**
 * create a new card
 * */
router.post('/', auth, checkAsync(async (req, res) => {
    const card = req.body
    let cardModel = new CardModel(card);
    cardModel.creator = req.user.id
    cardModel.createdAt = new Date()
    await cardModel.save();
    res.success(cardModel);
}));

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
    }).exec();
    res.json(card);
}));

/**
 * delete a card
 * */
router.delete('/:id', auth, checkAsync(async (req, res) => {
    const card = await CardModel.findById(req.params.id);
    if (!card) {
        res.notFound()
        return
    }
    await card.remove();
    res.success(card, 'card deleted successfully');
}));

module.exports = router