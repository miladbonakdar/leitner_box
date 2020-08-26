const express = require('express');
const router = express.Router();
const {checkAsync} = require('./utils/checkApifunctions');
/**
 * remove wrong answers from learning list
 */
router.post('/update-session', checkAsync(async (req, res) => {
    res.json({});
}));

router.post('/new-session', checkAsync(async (req, res) => {
    res.json({});
}));

router.get('/get-session-cards/:session', checkAsync(async (req, res) => {
    res.json({});
}));

module.exports = router