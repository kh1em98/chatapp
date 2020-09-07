const express = require('express');
const Token = require('../models/Token');
const router = express.Router();
const {
    issueJwt
} = require("../lib/utils");
const {
    authenticateAndVerify
} = require("../middlewares/auth");
const jwt = require('jsonwebtoken');

// Xac thuc email khi click vao link gui trong email
router.get('/', async (req, res) => {
    const fullJwt = req.cookies.headerAndPayload + '.' + req.cookies.signature;
    let decodedJwt;
    try {
        decodedJwt = await jwt.verify(fullJwt, process.env.SECRET_KEY);
    } catch (error) {
        res.render('error');
    }
    const tokenQuery = req.query.token;
    const findToken = await Token.findOne({
        token: tokenQuery
    }).populate('user');

    if (findToken === null) {
        res.render('error');
    } else if (findToken.user.isVerified) {
        res.render('error');
    } else if (findToken.user._id != decodedJwt._id) {
        res.render('error');
    } else {
        findToken.user.isVerified = true;
        issueJwt(findToken.user, res);
        await findToken.user.save();
        await Token.deleteOne({
            _id: findToken._id
        });
        res.render('success');
    }
})

// Kiem tra xem user da authenticate va verify chua 
router.post('/', authenticateAndVerify, (req, res) => {
    issueJwt(req.decoded, res);
    res.json({
        isError: false
    })
})

// Render screen success
router.get('/success', (req, res) => {
    res.render('success');
})

// Render screen error 
router.get('/error', (req, res) => {
    res.render('error');
})


module.exports = router;