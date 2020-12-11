const express = require('express')
const router = express.Router()
const {checkAsync} = require('./utils/checkApifunctions')
const auth = require('./utils/passportAuthenticator')
const {CategoryModel} = require('../models/category.model')
const {CardModel} = require('../models/card.model')
const User = require('../models/user.model')
const _ = require('lodash')

router.post('/', auth, checkAsync(async (req, res) => {
    const cat = req.body
    if (!req.user.isAdmin) {
        const categoriesCount = await CategoryModel.countDocuments({
            creator: req.user.id
        })
        if (categoriesCount >= 5) {
            res.badRequest('You can have at most 5 category')
            return
        }
        if (!cat.isPrivate) cat.isPrivate = true
    }
    let categoryModel = new CategoryModel(cat)
    categoryModel.creator = req.user.id
    categoryModel.createdAt = new Date()
    await categoryModel.save()
    res.success(categoryModel)
}))

router.put('/', auth, checkAsync(async (req, res) => {
    const cat = await CategoryModel.findById(req.body.id)
    if (!cat) return res.notFound()
    const catJson = cat.toJSON()
    if (catJson.creator.toString() !== req.user.id && !req.user.isAdmin)
        return res.accessDenied('just the owner and the admin can update a category')
    if (!catJson.isPrivate)
        return res.badRequest('public category cannot be updated')
    await CategoryModel.updateOne({_id: req.body.id}, {
        $set: {
            name: req.body.name,
            description :req.body.description
        }
    }).exec()
    res.json(cat)
}))

router.delete('/:id', auth, checkAsync(async (req, res) => {
    const cat = await CategoryModel.findById(req.params.id)
    if (!cat)
        return res.notFound()
    const catJson = cat.toJSON()
    if (catJson.creator.toString() !== req.user.id && !req.user.isAdmin)
        return res.accessDenied('just the owner and the admin can delete a category')
    if (!catJson.isPrivate)
        return res.badRequest('public category cannot be deleted')
    await cat.remove()
    await CardModel.deleteMany({
        'category.id': catJson.id
    })
    res.success(cat, 'category deleted successfully')
}))

router.get('/list/:size/:page', auth, checkAsync(async (req, res) => {
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const search = req.query.search && req.query.search.toLowerCase()
    const [cats, total] = await Promise.all([
        CategoryModel.find({
            ...(search && {name: {$regex: search, $options: 'i'}}),
            creator: req.user.id
        }, {}, {skip: size * page, limit: size}).populate('creator',
            {
                name: true,
                isAdmin: true,
                username: true,
                id: true,
                _id: true
            }).sort('-createdAt'),
        CategoryModel.countDocuments({
            ...(search && {name: {$regex: search, $options: "i"}})
        })])
    res.success({
        categories: cats,
        total,
        page,
        size
    })
}))

router.get('/my-categories', auth, checkAsync(async (req, res) => {
    const user = (await User.findById(req.user.id, {
        selectedCategories: true
    })).toJSON()

    const categories = await CategoryModel.find({
        creator: req.user.id
    }).populate('creator',
        {
            name: true,
            isAdmin: true,
            username: true,
            id: true,
            _id: true
        }).sort('-createdAt')
    const items = []
    for (const category of categories) {
        items.push({
            ...category.toJSON(),
            learning: user.selectedCategories.some(s => s.toString() === category.id.toString())
        })
    }

    res.success(items)
}))


router.get('/suggestions/:size/:page/:lang', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
    const size = Number(req.params.size)
    const lang = Number(req.params.lang)
    const page = Number(req.params.page)
    const search = req.query.search && req.query.search.toLowerCase()
    const ignoreList = user.selectedCategories
    const query = {
        _id: {$nin: ignoreList},
        ...(search && {name: {$regex: search, $options: "i"}}),
        ...(lang && {language: {$regex: lang, $options: "i"}}),
        $or: [
            {isPrivate: false},
            {creator: req.user.id}
        ]
    }
    const [categories, total] = await Promise.all([
        CategoryModel.find(query, {}, {
            skip: size * page,
            limit: size
        }),
        CategoryModel.countDocuments(query)])
    const catCardsCount = await Promise.all(categories.map(c => CardModel.countDocuments({'category.id': c.id.toString()}).exec()))

    const cats = categories.map(c => {
        return {
            ...c.toJSON(),
            cards: catCardsCount.shift()
        }
    })

    res.success({
        categories: cats,
        total,
        page,
        size
    })
}))

router.get('/:id', auth, checkAsync(async (req, res) => {
    const cat = await CategoryModel.findById(req.params.id)
        .populate('creator',
            {
                name: true,
                isAdmin: true,
                username: true,
                id: true,
                _id: true
            })
    if (!cat)
        return res.notFound()
    if (cat.isPrivate && cat.creator !== req.user.id)
        return res.accessDenied('You cannot access this category')

    const catJson = cat.toJSON()
    const cards = await CardModel.find({
        'category.id': catJson._id.toString()
    })

    res.success({
        category: cat,
        cards: cards
    })
}))

/**
 * add to favorite
 * */
router.put('/add-to-favorite/:id', auth, checkAsync(async (req, res) => {
    const catId = req.params.id
    const user = await User.findById(req.user.id)
    if (user.selectedCategories.length >= 3)
        return res.badRequest('you can have 3 selected categories at most')
    const found = await CategoryModel.countDocuments({_id: catId})
    if (!found) return res.notFound()
    await User.findByIdAndUpdate(req.user.id,
        {$addToSet: {selectedCategories: catId}}, {safe: true, useFindAndModify: false})
    res.success(catId)
}))

/**
 * add to favorite
 * */
router.delete('/remove-from-favorite/:id', auth, checkAsync(async (req, res) => {
    const catId = req.params.id
    const found = await CategoryModel.countDocuments({_id: catId})
    if (!found) return res.notFound()
    await User.findByIdAndUpdate(req.user.id,
        {$pull: {selectedCategories: {$in: [catId]}}}, {safe: true, useFindAndModify: false})
    res.success(catId)
}))

/**
 * get user favorites
 * */
router.get('/favorites/:size/:page', auth, checkAsync(async (req, res) => {
    const user = await User.findById(req.user.id)
    const size = Number(req.params.size)
    const page = Number(req.params.page)
    const ignoreList = _.union(user.learning, user.learned)
    const query = {
        'category.id': {$in: user.selectedCategories},
        _id: {$nin: ignoreList}
    }
    const [cards, total] = await Promise.all([
        CardModel.find(query, {}, {skip: size * page, limit: size}).populate('creator',
            {
                name: true,
                isAdmin: true,
                username: true,
                id: true,
                _id: true
            }).sort('-createdAt'),
        CardModel.countDocuments(query)])
    res.success({
        cards,
        total
    })
}))

router.patch('/rate/:catId/:rate', auth, checkAsync(async (req, res) => {
    const cat = await CategoryModel.findById(req.params.catId)
    const rate = Number(req.params.rate)
    if (!cat) return res.notFound('category cannot be found')
    let rating = cat.rating.filter(r => r.userId.toString() === req.user.id)[0]
    if (!rating) {
        rating = {
            userId: req.user.id,
            rate: rate
        }
        cat.rating.push(rating)
    } else {
        rating.rate = rate
    }
    await cat.save()
    res.success(cat.toJSON())
}))

router.patch('/make-public/:catId', auth, checkAsync(async (req, res) => {
    if (!req.user.isAdmin)
        return res.accessDenied("only the admin can make a category public")
    await changeCategoryStatus(res, req.params.catId, false)
}))

router.patch('/make-private/:catId', auth, checkAsync(async (req, res) => {
    if (!req.user.isAdmin)
        return res.accessDenied("only the admin can make a category private")
    await changeCategoryStatus(res, req.params.catId, true)
}))

async function changeCategoryStatus(res, catId, status) {
    const cat = await CategoryModel.findById(catId)
    if (!cat) return res.notFound('category cannot be found')
    cat.isPrivate = status
    await cat.save()
    res.success(cat.toJSON())
}

module.exports = router