const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validate = require('../middlewares/validate');
const {
    commonEmitter
} = require('../config/emitter');

router.post('/', validate.register, async (req, res) => {

    let {
        email,
        password,
        name
    } = req.body;
    let responseToClient = {
        isError: false
    }
    const existUser = await User.findOne({
        email
    });

    if (existUser === null) {
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            name,
            email,
            password: hashPassword
        })
        await newUser.save();
        commonEmitter.emit('coNguoiDangKy', {
            name,
            avatar: "https://i.kym-cdn.com/photos/images/original/001/882/230/7fd.jpg",
            _id: newUser._id
        });

    } else {
        responseToClient = {
            isError: true,
            error: 'Email đã được đăng ký'
        }
    }



    res.json(responseToClient);
})

module.exports = router;