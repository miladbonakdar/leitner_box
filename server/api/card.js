const express = require('express');
const router = express.Router();
const auth = require('./utils/passportAuthenticator');
const {checkAsync} = require('./utils/checkApifunctions');

/**
 * get one card
 * */
router.get('/:id', auth, checkAsync(async (req, res) => {
    res.json({});
}));

/**
 * get user favorites
 * */
router.get('/favorites/:size/:page', auth, checkAsync(async (req, res) => {
    res.json({});
}));

/**
 * get user learned cards
 * */
router.get('/learned/:size/:page', auth, checkAsync(async (req, res) => {
    res.json({});
}));

/**
 * get user learned cards
 * */
router.get('/learning/:size/:page', auth, checkAsync(async (req, res) => {
    res.json({});
}));

/**
 * explore new cards for user
 * */
router.get('/suggestions/:size/:page', auth, checkAsync(async (req, res) => {
    res.json({});
}));

/**
 * create a new card
 * */
router.post('/', auth, checkAsync(async (req, res) => {
    res.json({});
}));

/**
 * modify a card
 * */
router.put('/', auth, checkAsync(async (req, res) => {
    res.json({});
}));

/**
 * delete a card
 * */
router.delete('/:id', auth, checkAsync(async (req, res) => {
    res.json({});
}));

module.exports = router