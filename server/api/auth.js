const express = require('express');
const router = express.Router();
const {checkAsync} = require('./utils/checkApifunctions');
const passport = require('passport');
const jwt_token = require('../app.config').get().jwt_secret;
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const auth = require('./utils/passportAuthenticator');
const jwt = require('jsonwebtoken');

router.get('/user', auth, checkAsync(async (req, res) => {
    const user = (await User.findById(req.user.id)).toJSON();
    res.json({
        name: user.name,
        username: user.username,
        learnedCount: user.learned.length,
        wantToLearnCount: user.wantToLearn.length,
        learningCount: user.learning.length,
        box: user.box,
        session: user.session
    });
}));

router.post('/login', (req, res) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            res.echo(info.message, null, false, 401);
            return;
        }

        req.login(user, {session: false}, err => {
            if (err) res.internalServerError(err);

            const token = jwt.sign(user, jwt_token, {expiresIn: '10d'});
            res.success({user, token}, 'user logged in successfully');
        });
    })(req, res);
});

router.post('/register', checkAsync(async (req, res) => {
    const userDto = req.body
    userDto.learned = []
    userDto.wantToLearn = []
    userDto.learning = []
    userDto.box = []

    userDto.session = {
        lastSlot: 0,
        isOpen: false
    }

    userDto.password = await bcrypt.hash(userDto.password, await bcrypt.genSalt(4));
    let user = new User(userDto);
    await user.save();
    delete user.password
    res.success(user, 'you have been registered');
}));

module.exports = router