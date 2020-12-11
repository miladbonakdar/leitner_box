const express = require('express')
const router = express.Router()
const {checkAsync} = require('./utils/checkApifunctions')
const path = require('path');
const fs = require('fs');
const languages = require('../models/languages.enum');
const types = require('../models/cardTypes.enum');

router.get('/sound/:sound', checkAsync(async (req, res) => {
    const sound = req.params.sound
    const soundPath = path.resolve(__baseDirname, 'assets', sound)
    if (!fs.existsSync(soundPath))
        res.notFound('sound cannot be found. path:' + soundPath)

    const stat = fs.statSync(soundPath);

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', stat.size)

    fs.createReadStream(soundPath).pipe(res);
}))

router.get('/languages', checkAsync(async (_, res) => {
    res.success(languages)
}))

router.get('/card-types', checkAsync(async (_, res) => {
    res.success(types)
}))

module.exports = router