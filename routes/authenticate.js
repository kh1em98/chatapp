const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    authenticate
} = require("../middlewares/auth");
const {
    issueJwt
} = require('../lib/utils');

router.post('/', authenticate, (req, res) => {
    issueJwt(req.decoded, res);
    res.json({
        isError: false
    })
})

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}))


router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/',
}), (req, res) => {
    issueJwt(req.user, res);
    res.redirect('/profile');
})

module.exports = router;