const express = require('express');
const router = express.Router();
const {
    isValidPassword,
    issueJwt
} = require('../lib/utils');
const validate = require('../middlewares/validate');
const User = require('../models/User');

router.post('/', validate.login, async (req, res) => {
    const {
        email,
        password
    } = req.body;

    let responseToClient = {}
    const existUser = await User.findOne({
        email: email
    })
    
    if (existUser === null) {
        responseToClient = {
            isError: true,
            error: 'Sai thông tin đăng nhập'
        }
        res.json(responseToClient);
    } else {
        if (!existUser.password) {
            responseToClient = {
                isError: true,
                error: 'Sai thông tin đăng nhập'
            }
            res.json(responseToClient);
        } else {
            let isValid = await isValidPassword(password, existUser.password);
            if (isValid) {
                issueJwt(existUser, res);
                res.json({
                    isError: false,
                })

            } else {
                responseToClient = {
                    isError: true,
                    error: 'Sai thông tin đăng nhập'
                }
                res.json(responseToClient);
            }
        }
    }
})


module.exports = router;