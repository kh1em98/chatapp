const {
    response
} = require('express');
const User = require('../models/User');

module.exports = {
    register: (req, res, next) => {
        let {
            email,
            name,
            password,
            repeatPassword,
        } = req.body;
        const validateName = /^[A-Za-z]+([\ A-Za-z]+)*/;
        const validateEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let responseToClient;
        let isError = false;


        if (!email || !name || !password || !repeatPassword) {
            responseToClient = {
                isError: true,
                error: 'Hãy điền đủ thông tin'
            }
            isError = true;
        } else if (!validateName.test(name) || !validateEmail.test(email)) {
            responseToClient = {
                isError: true,
                error: 'Tên hoặc email không hợp lệ'
            }
            isError = true;
        } else if (password !== repeatPassword) {
            responseToClient = {
                isError: true,
                error: 'Password lặp lại không trùng'
            }
            isError = true;
        }
        if (isError) {
            responseToClient = JSON.stringify(responseToClient);
            res.end(responseToClient);
        } else {
            next();
        }
    },
    login: async (req, res, next) => {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            let responseToClient = {
                isError: true,
                error: 'Hãy điền đủ thông tin'
            }
            res.json(responseToClient)
        } else {
            next();
        }
    }
}