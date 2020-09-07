const express = require('express');
const router = express.Router();

const Token = require('../models/Token');
const crypto = require('crypto');
const sendMail = require('../lib/sendMail');
const {
    authenticate
} = require('../middlewares/auth');

const {
    issueJwt
} = require('../lib/utils');


router.post('/', authenticate, async (req, res) => {
    // Tao token ngau nhien
    const randomToken = crypto.randomBytes(128).toString('hex');
    const newTokenDB = new Token({
        user: req.decoded._id,
        token: randomToken
    });
    await newTokenDB.save();
    const message = "https://ch4t4pp:8080/api/verify?token=" + randomToken;
    await sendMail(req.decoded.name, req.decoded.email, message);
    res.json({
        isError: false,
    });
})


module.exports = router;