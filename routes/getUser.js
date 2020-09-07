const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");
const {
    authenticate
} = require("../middlewares/auth");

router.post('/', authenticate, async (req, res) => {
    let allUser = await User.find({}, 'name avatar');
    allUser = JSON.parse(JSON.stringify(allUser));
    res.json(allUser);
})

router.delete('/', async (req, res) => {
    await User.deleteMany({});
    await Message.deleteMany({});
    res.end('Dit con me may');
})

router.post('/mess', async (req, res) => {
    let allMess = await Message.find({});
    allMess = JSON.parse(JSON.stringify(allMess));
    res.json(allMess);
})

module.exports = router;