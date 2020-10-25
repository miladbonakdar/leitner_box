const rateLimit = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const mediumLvl = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 // limit each IP
});

const highLvl = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10 // limit each IP
});

const lowLevel = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 1000 // limit each IP
});

module.exports = {
    highLvl,
    lowLevel,
    mediumLvl
}